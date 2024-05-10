import { Router } from "express";
import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { db } from "../database/sqlite.js";
import { JWT_SECRET } from "../config.js";
import { adminOnly, authenticate } from "../middlewares/auth.js";

export const userRouter = Router();
const saltRounds = 10

userRouter.get("/user", authenticate, adminOnly, (req, res) => {

    db.all("SELECT id, username, age, role FROM user", [], (err, rows) => {

        if(err) {
            return res.status(404).send("Users not found.")
        }

        res.send(JSON.stringify(rows))
    })
})

userRouter.get("/user/account", authenticate, (req, res) => {
    try {
        if (!req.userData) {
            return res.status(404).send("User data not found.")
        }

        res.json(req.userData)

    } catch (error) {
        res.status(500).send("Internal server error.")
    }
})

userRouter.get("/user/:id", (req, res) => {
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

userRouter.post("/user/login", (req, res) => {

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

userRouter.post("/user/logout", async (req, res) => {
    try {
        res.clearCookie('accessToken')
        res.sendStatus(200)
    } catch {
        res.clearCookie('accessToken')
        res.sendStatus(500)
    }

    // Vaihtoehtoinen tapa, jossa myös JTI poistetaan tietokannasta
    /*const accessToken = req.cookies.accessToken

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
    })*/
})

userRouter.post("/user", async (req, res) => {

    const {username, password, age, role} = req.body

    if(!username || !Number.isInteger(age)  || !password || !role){
        return res.status(400).send("Please check the provided information and fill in the missing fields.")
    }

    const hashedPassword = await hash(password, saltRounds)
    
    const stmt = db.prepare("INSERT INTO user VALUES (NULL, ?, ?, ?, NULL, ?)")
    
    stmt.run(username, hashedPassword, age, role, (err) => {

        if(err){
            return res.status(409).send("Username taken, try another username.")
        }

        res.status(201).send("User created successfully.")  
    })       
})

userRouter.put("/user", authenticate, adminOnly, (req, res) => {

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

userRouter.patch("/user", authenticate, (req, res) => {
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

userRouter.delete("/user/:id", authenticate, adminOnly, (req, res) => {
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
