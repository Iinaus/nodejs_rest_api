import { logout } from './utils/logout.js'
import { getUsers } from './utils/getUsers.js'

async function getUser() {
    try {
        const response = await fetch("http://localhost:3000/api/v1/user/account")

        const { username, age, role } = await response.json()

        return { username, age, role }

    } catch (error){
        console.log(error)
    }    
}

document.addEventListener("DOMContentLoaded", async () => {
    const { username, age, role } = await getUser()

    const text = document.createElement("p")
    text.innerHTML = `Hello ${username}`

    const logoutBtn = document.createElement("button")
    logoutBtn.innerText = "Kirjaudu ulos"
    logoutBtn.addEventListener("click", logout)

    const showUserInfo = document.createElement("button")
    showUserInfo.innerText = "Katso omat tiedot"
    showUserInfo.addEventListener("click", () => {
        const userInfo = document.createElement("div")
        userInfo.innerHTML = `<ul>${username}, ${age}, ${role}</ul>`
        document.body.append(userInfo)
    })

    const text2 = document.createElement("p")

    document.body.append(text, showUserInfo, logoutBtn, text2)

    if (role === "admin") {
        text2.innerHTML = `Tämä näkyy vain adminille`
        const listAllUsersBtn = document.createElement("button")
        listAllUsersBtn.innerText = "Katso kaikki käyttäjät"
        listAllUsersBtn.addEventListener("click", async () => {
            try {
                const data = await getUsers()
                console.log("Vastauksen data:", data)
                const list = document.createElement("div")
                list.innerHTML = data.map(user => `<ul>${user.id}, ${user.username}, ${user.age}, ${user.role}</ul>`)
                .join("")
                document.body.append(list)                
            } catch (error) {
                console.error("Virhe käyttäjien listauksessa:", error)
            }
        })

        const deleteUserBtn = document.createElement("button")
        deleteUserBtn.innerText = "Poista käyttäjä"

        const editUserBtn = document.createElement("button")
        editUserBtn.innerText = "Muokkaa käyttäjää"
    
        document.body.append(listAllUsersBtn, deleteUserBtn, editUserBtn)
    } else if (role === "user"){
        text2.innerHTML = `Tämä näkyy usereille`
    } else {
        window.location.href = "index.html"
    }    
})