import { login } from './utils/login.js';

const loginForm = document.getElementById("login")

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