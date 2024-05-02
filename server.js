import express, { Router } from "express";
import cookieParser from "cookie-parser";
import { db } from "./database/sqlite.js";
import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { JWT_SECRET } from "./src/config.js";
import { adminOnly, authenticate } from "./src/middlewares/auth.js";

const app = express();

app.use(express.json())
app.use(cookieParser())

const router = Router();
const saltRounds = 10

router.get("/user", authenticate, adminOnly, (req, res) => {

    db.all("SELECT id, username, age, role FROM user", [], (err, rows) => {

        if(err) {
            return res.status(404).send("Users not found")
        }

        res.send(JSON.stringify(rows))
    })
})

router.get("/user/account", authenticate, (req, res) => {
    try {
        if (!req.userData) {
            return res.status(404).send("User data not found")
        }

        res.json(req.userData)

    } catch (error) {
        res.status(500).send("Internal server error")
    }
})

router.get("/user/:id", (req, res) => {
    const id = req.params.id

    db.get("SELECT id, username, age, role FROM user WHERE id = ?", [id], (err,row) => {

        if(err) {
            return res.status(404).send("User not found")
        } 

        if(!row) {
            return res.status(404).send("User not found")
        }
        
        res.send(JSON.stringify(row))
               
    })
})

router.post("/user/login", (req, res) => {

    const {username, password} = req.body

    if(!username || !password){
        return res.status(400).send()
    }

    db.get("SELECT id, password, role FROM user WHERE username = ?", [username], async (err,row) => {

        if(err) {
            return res.status(400).send()
        } 

        if(!row) {
            return res.status(404).send()
        }
        
        const isAuthenticated = await compare(password, row.password)

        if(isAuthenticated) {

            const jti = crypto.randomUUID()

            const token = jwt.sign({
                role: row.role
            }, JWT_SECRET, {
                expiresIn: "1h",
                jwtid: jti
            })

            db.serialize(() => {

                const stmt = db.prepare("UPDATE user SET jti = ? WHERE id = ?")
                
                stmt.run(jti, row.id)
                
                stmt.finalize()
        
                res.cookie("accessToken", token, {
                    httpOnly: true,
                    sameSite: "lax",
                    secure: true
                })
    
                return res.send("Login successful")
            })
        } else {
            return res.status(400).send()
        }
               
    })

})

router.post("/user", async (req, res) => {

    const {username, password, age, role} = req.body

    if(!username || !age || !password || !role){
        return res.status(400).send("Check given information.")
    }

    const hashedPassword = await hash(password, saltRounds)
    
    const stmt = db.prepare("INSERT INTO user VALUES (NULL, ?, ?, ?, NULL, ?)")
    
    stmt.run(username, hashedPassword, age, role, (err) => {

        if(err){
            /* Ei tehdä tuotantoympäristössä, mutta kehitysympäristössä auttaa virheen käsittelyssä
            return res.status(400).json({
                error: err
            })*/

            return res.status(400).json({
                error: "Kokeile toista käyttäjänimeä"
            })
        }

        res.status(201).send("Käyttäjä luotu onnistuneesti")  
    })       
})

router.put("/user", (req, res) => {

    const {username, age, id} = req.body

    if(!username || !age || !id){
        return res.status(400).send("Tarkista tiedot.")
    }

    db.serialize(() => {

        const stmt = db.prepare("UPDATE user SET username = ?, age = ? WHERE id = ?")
        
        stmt.run(username, age, id, (err) => {

            stmt.finalize()

            if (err) {

                if (err.code === "SQLITE_CONSTRAINT") {
                    return res.status(400).send("Käyttäjänimi on jo käytössä.");
                }

                console.error("Error updating user:", err)
                return res.status(500).send("Virhe käyttäjän päivittämisessä.")
            }

            res.send("Käyttäjä päivitetty onnistuneesti");
        })
    })    
})

router.patch("/user", authenticate, (req, res) => {
    const {age} = req.body;
    const {id} = req.userData;

    if (!age) {
        return res.status(400).send("Ikä puuttuu")
    }

    db.run("UPDATE user SET age = ? WHERE id = ?", [age, id], (err) => {
        
        if (err) {
            return res.status(500).send("Virhe käyttäjän iän päivittämisessä")
        }

        res.send("Käyttäjän ikä päivitetty onnistuneesti")
    })
})

router.delete("/user/:id", (req, res) => {
    const id = req.params.id

    db.run("DELETE FROM user WHERE id = ?", [id], (err) => {
        
        if(err){
            return res.status(404).send()
        }

        res.send("Käyttäjätili poistettu onnistuneesti")

    })    
})

// Rajapinnan laajennus alkaa tästä

router.post("/store", authenticate, adminOnly, async (req, res) => {

    const {name, address} = req.body

    if(!name || !address ){
        return res.status(400).send("Tarkista tiedot: kaupan nimi ja osoite ovat pakollisia.")
    }
    
    const stmt = db.prepare("INSERT INTO stores VALUES (NULL, ?, ?)")
    
    stmt.run(name, address, (err) => {

        if(err){

            return res.status(400).json({
                error: "Kaupan nimi on jo käytössä. Kokeile toista nimeä kaupalle."
            })
        }

        res.status(201).send("Kauppa luotu onnistuneesti")  
    })       
})

router.get("/store", (req, res) => {

    db.all("SELECT * FROM stores", [], (err, rows) => {

        if(err) {
            return res.status(404).send("Stores not found")
        }

        res.send(JSON.stringify(rows))
    })
})

router.get("/store/:id", (req, res) => {
    const id = req.params.id

    db.get("SELECT * FROM stores WHERE id = ?", [id], (err,row) => {

        if(err) {
            return res.status(404).send("Store not found")
        } 

        if(!row) {
            return res.status(404).send("Store not found")
        }
        
        res.send(JSON.stringify(row))
               
    })
})

router.put("/store", authenticate, adminOnly, (req, res) => {

    const {id, name, address} = req.body

    if(!id || !name || !address){
        return res.status(400).send("Check given information")
    }

    db.serialize(() => {

        const stmt = db.prepare("UPDATE stores SET name = ?, address = ? WHERE id = ?")
        
        stmt.run(name, address, id)
        
        stmt.finalize()

        res.send("Store information updated")

    })    
})

router.delete("/store/:id", authenticate, adminOnly, (req, res) => {
    const id = req.params.id

    db.run("DELETE FROM stores WHERE id = ?", [id], function(err) {
        if(err){
            return res.status(500).send("Internal Server Error")
        }

        if (this.changes === 0) {
            return res.status(404).send("Store not found")
        }

        res.send("Store deleted")
    })    
})

app.use("/api/v1", router)

app.use(express.static("public"))

app.listen(3000, ()=>{
    console.log("HTTP Server is running on port http://localhost:3000")
})