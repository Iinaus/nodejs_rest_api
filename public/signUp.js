import { login } from './utils/login.js';

const signUpForm = document.getElementById("signUp")

signUpForm.addEventListener("submit", (e) => {

    e.preventDefault()

    const credentials = {
        username: signUpForm.username.value,
        age: parseInt(signUpForm.age.value),
        password: signUpForm.password.value,
        role: "user"
    }

    fetch("/api/v1/user", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(async (response) => {
        if (response.ok) {
            alert("New user created successfully. Click ok to log in.")

            try {
                await login(credentials)
            } catch (error) {
                alert(error.message)
            }

        } else {
            response.text().then((errorMessage) => {
                alert(errorMessage)
            }).catch((error) => {
                console.error("Error parsing error message:", error)
                alert("An error occurred while processing your request.")
            })
        }
    })
})
