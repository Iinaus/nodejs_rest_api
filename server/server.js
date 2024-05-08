import express, { Router } from "express";
import cookieParser from "cookie-parser";
import { db } from "./database/sqlite.js";
import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { JWT_SECRET } from "./config.js";
import { adminOnly, authenticate } from "./middlewares/auth.js";

const app = express();

app.use(express.json())
app.use(cookieParser())

const router = Router();
const saltRounds = 10

router.get("/user", authenticate, adminOnly, (req, res) => {

    db.all("SELECT id, username, age, role FROM user", [], (err, rows) => {

        if(err) {
            return res.status(404).send("Users not found.")
        }

        res.send(JSON.stringify(rows))
    })
})

router.get("/user/account", authenticate, (req, res) => {
    try {
        if (!req.userData) {
            return res.status(404).send("User data not found.")
        }

        res.json(req.userData)

    } catch (error) {
        res.status(500).send("Internal server error.")
    }
})

router.get("/user/:id", (req, res) => {
    const id = req.params.id

    db.get("SELECT id, username, age, role FROM user WHERE id = ?", [id], (err,row) => {

        if(err) {
            return res.status(404).send("User not found.")
        } 

        if(!row) {
            return res.status(404).send("User not found.")
        }
        
        res.send(JSON.stringify(row))
               
    })
})

router.post("/user/login", (req, res) => {

    const {username, password} = req.body

    if(!username || !password){
        return res.status(400).send("Please check the provided information and fill in the missing fields.")
    }

    db.get("SELECT id, password, role FROM user WHERE username = ?", [username], async (err,row) => {

        if(err) {
            return res.status(400).send("Login failed. Please check your username and password and try again.")
        } 

        if(!row) {
            return res.status(404).send("Login failed. Please check your username and password and try again.")
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
    
                return res.send("Login successful.")
            })
        } else {
            return res.status(400).send("Login failed. Please check your username and password and try again.")
        }               
    })
})

// clientia varten endpoint jtwTokenin tarkistamista varten
app.post("/checkToken", authenticate, (req, res) => {
    if (req.userData) {
        res.status(200).json({ message: "Valid token" })
    } else {
        res.status(401).json({ message: "Invalid token" })
    }
})

router.post("/user/logout", (req, res) => {
    const accessToken = req.cookies.accessToken

    if (!accessToken) {
        return res.status(401).send("Unauthorized")
    }

    jwt.verify(accessToken, JWT_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(401).send("Unauthorized")
        }

        const { jti } = decoded

        db.run("UPDATE user SET jti = NULL WHERE jti = ?", [jti], (err) => {
            if (err) {
                return res.status(500).send("Internal Server Error")
            }

            res.clearCookie("accessToken")
            return res.send("Logout successful.")
        })
    })
})

router.post("/user", async (req, res) => {

    const {username, password, age, role} = req.body

    if(!username || !Number.isInteger(age)  || !password || !role){
        return res.status(400).send("Please check the provided information and fill in the missing fields.")
    }

    const hashedPassword = await hash(password, saltRounds)
    
    const stmt = db.prepare("INSERT INTO user VALUES (NULL, ?, ?, ?, NULL, ?)")
    
    stmt.run(username, hashedPassword, age, role, (err) => {

        if(err){
            /* Ei tehdä tuotantoympäristössä, mutta kehitysympäristössä auttaa virheen käsittelyssä
            return res.status(400).json({
                error: err
            })*/

            return res.status(409).send("Username taken, try another username.")
        }

        res.status(201).send("User created successfully.")  
    })       
})

router.put("/user", authenticate, adminOnly, (req, res) => {

    const {username, age, id, role} = req.body

    if(!username || !Number.isInteger(age) || !Number.isInteger(id) || !role){
        return res.status(400).send("Please check the provided information and fill in the missing fields.")
    }

    db.serialize(() => {

        const stmt = db.prepare("UPDATE user SET username = ?, age = ?, role = ? WHERE id = ?")
        
        stmt.run(username, age, role, id, function(err) {

            stmt.finalize()

            if (this.changes === 0) {
                return res.status(404).send("User not found, please check the id.")
            }

            if (err) {
                if (err.code === "SQLITE_CONSTRAINT") {
                    return res.status(409).send("Username taken, try another username.");
                }

                return res.status(500).send("Error updating user.")
            }

            res.send("User updated succesfully.")
        })
    })    
})

router.patch("/user", authenticate, (req, res) => {
    const {age} = req.body;
    const {id} = req.userData;

    if (!Number.isInteger(age)) {
        return res.status(400).send("Please check the provided information and fill in the missing fields.")
    }

    db.run("UPDATE user SET age = ? WHERE id = ?", [age, id], (err) => {
        
        if (err) {
            return res.status(500).send("Error updating user's age.")
        }

        res.send("User's age updated successfully.")
    })
})

router.delete("/user/:id", authenticate, adminOnly, (req, res) => {
    const id = req.params.id

    db.run("DELETE FROM user WHERE id = ?", [id], function(err) {
        if(err){
            return res.status(500).send("Internal Server Error.")
        }

        if (this.changes === 0) {
            return res.status(404).send("User not found, please check the id.")
        }

        res.send("User deleted successfully.")
    })    
})

// Rajapinnan laajennus alkaa tästä

router.post("/store", authenticate, adminOnly, async (req, res) => {

    const {name, address} = req.body

    if(!name || !address ){
        return res.status(400).send("Check the information: store name and address are mandatory.")
    }
    
    const stmt = db.prepare("INSERT INTO stores VALUES (NULL, ?, ?)")
    
    stmt.run(name, address, (err) => {

        if(err){

            return res.status(409).json({
                error: "Name taken, try another name."
            })
        }

        res.status(201).send("Store created successfully.")  
    })       
})

router.get("/store", (req, res) => {

    db.all("SELECT * FROM stores", [], (err, rows) => {

        if(err) {
            return res.status(404).send("Stores not found.")
        }

        res.send(JSON.stringify(rows))
    })
})

router.get("/store/:id", (req, res) => {
    const id = req.params.id

    db.get("SELECT * FROM stores WHERE id = ?", [id], (err,row) => {

        if(err) {
            return res.status(404).send("Store not found.")
        } 

        if(!row) {
            return res.status(404).send("Store not found.")
        }
        
        res.send(JSON.stringify(row))
               
    })
})

router.put("/store", authenticate, adminOnly, (req, res) => {

    const {id, name, address} = req.body

    if(!Number.isInteger(id) || !name || !address){
        return res.status(400).send("Check the provided information and fill in the missing fields.")
    }

    db.serialize(() => {

        const stmt = db.prepare("UPDATE stores SET name = ?, address = ? WHERE id = ?")

        stmt.run(name, address, id, function(err) {

            stmt.finalize()

            if (this.changes === 0) {
                return res.status(404).send("Store not found, please check the id.")
            }

            if (err) {

                if (err.code === "SQLITE_CONSTRAINT") {
                    return res.status(409).send("Name taken, try another name.")
                }

                return res.status(500).send("Error updating store.")
            }

            res.send("User updated succesfully.");
        })

    })    
})

router.delete("/store/:id", authenticate, adminOnly, (req, res) => {
    const id = req.params.id

    db.run("DELETE FROM stores WHERE id = ?", [id], function(err) {
        if(err){
            return res.status(500).send("Internal Server Error")
        }

        if (this.changes === 0) {
            return res.status(404).send("Store not found, please check the id.")
        }

        res.send("Store deleted successfully.")
    })    
})

app.use("/api/v1", router)

app.use(express.static("public"))

app.listen(3000, ()=>{
    console.log("HTTP Server is running on port http://localhost:3000")
})