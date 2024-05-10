import { Router } from "express";
import { db } from "../database/sqlite.js";
import { adminOnly, authenticate } from "../middlewares/auth.js";

export const storeRouter = Router();

storeRouter.post("/store", authenticate, adminOnly, async (req, res) => {

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

storeRouter.get("/store", (req, res) => {

    db.all("SELECT * FROM stores", [], (err, rows) => {

        if(err) {
            return res.status(404).send("Stores not found.")
        }

        res.send(JSON.stringify(rows))
    })
})

storeRouter.get("/store/:id", (req, res) => {
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

storeRouter.put("/store", authenticate, adminOnly, (req, res) => {

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

storeRouter.delete("/store/:id", authenticate, adminOnly, (req, res) => {
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