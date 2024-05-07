import { login } from './utils/login.js'
import { checkToken } from './utils/checkToken.js'

const loginForm = document.getElementById("login")

document.addEventListener("DOMContentLoaded", async () => {
    const tokenStatus = await checkToken();
    if (tokenStatus === "valid") {
        window.location.href = "dashboard.html"
    } 
})

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    const data = new FormData(loginForm)
    const credentials = Object.fromEntries(data)

    try {
        await login(credentials)
    } catch (error) {
        alert(error.message)
    }
})