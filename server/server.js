import express from "express";
import cookieParser from "cookie-parser";
import { userRouter } from "./routers/user_router.js";
import { storeRouter } from "./routers/store_router.js";
import { authenticate } from "./middlewares/auth.js";

const app = express()

app.use(express.json())
app.use(cookieParser())

// clientia varten endpoint jtwTokenin tarkistamista varten
app.post("/checkToken", authenticate, (req, res) => {
    if (req.userData) {
        res.status(200).json({ message: "Valid token" })
    } else {
        res.status(401).json({ message: "Invalid token" })
    }
})

app.use("/api/v1", userRouter)
app.use("/api/v1", storeRouter)

app.use(express.static("public"))

app.listen(3000, ()=>{
    console.log("HTTP Server is running on port http://localhost:3000")
})