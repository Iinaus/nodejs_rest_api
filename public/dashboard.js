import { logout } from './utils/logout.js'
import { checkToken } from './utils/checkToken.js'
import { getUsers } from './utils/getUsers.js'
import { deleteUser } from './utils/deleteUser.js'
import { editUser } from './utils/editUser.js'

async function getAccount() {
    try {
        const response = await fetch("http://localhost:3000/api/v1/user/account")

        const { username, age, role } = await response.json()

        return { username, age, role }

    } catch (error){
        console.log(error)
    }    
}

let showResultVisible = false
let resultContainer = null

function createResultContainer() {  
    resultContainer = document.createElement("div")
    resultContainer.id = "resultContainer"
    resultContainer.className = "container"

    const closeBtn = document.createElement("button")
    closeBtn.innerText = "Close"
    closeBtn.className = "close-button"
    closeBtn.addEventListener("click", () => {
        hideResultContainer()
    })

    resultContainer.append(closeBtn)
    resultContainer.style.display = "block"
    document.body.appendChild(resultContainer)  
    showResultVisible = true
}

function hideResultContainer() {
    if (resultContainer) {
        resultContainer.remove()
        resultContainer = null
        showResultVisible = false
    }
}

function showUserInfo(username, age, role) {
    if (resultContainer) {  
        hideResultContainer()
        createResultContainer()
    } else {
        createResultContainer()
    }

    const userInfo = document.createElement("p")
    userInfo.innerHTML = `<ul>${username}, ${age}, ${role}</ul>`
    resultContainer.append(userInfo) 
}

async function showUsers() {
    if (resultContainer) {  
        hideResultContainer()
        createResultContainer()
    } else {
        createResultContainer()
    }

    try {
        const data = await getUsers()
        const list = document.createElement("div")
        list.innerHTML = data.map(user => `<ul>${user.id}, ${user.username}, ${user.age}, ${user.role}</ul>`)
        .join("")
        resultContainer.append(list)              
    } catch (error) {
        console.error("Virhe käyttäjien listauksessa:", error)
    }  
}

function showDelete() {
    if (resultContainer) {  
        hideResultContainer()
        createResultContainer()
    } else {
        createResultContainer()
    }

    const text = document.createElement("p")
    text.innerText = "Write the ID of the user to be deleted."

    const deleteInput = document.createElement("input")
    deleteInput.type = "number"

    const deleteBtn = document.createElement("button")
    deleteBtn.innerText = "Delete"
    deleteBtn.addEventListener("click", () => {
        const id = deleteInput.value
        if (id) {
            deleteUser(id)
                .then(response => response.text())
                .then(message => {
                    alert(message)
                })
                .catch(error => {
                    alert("An error occurred: " + error.message)
                })
        } else {
            alert("User ID cannot be empty!")
        }
    })

    resultContainer.append(text, deleteInput, deleteBtn)
}

function showEdit() {
    if (resultContainer) {  
        hideResultContainer()
        createResultContainer()
    } else {
        createResultContainer()
    }

    const text = document.createElement("p")
    text.innerText = "Write the ID of the user to be edited and add new username and age."

    const idInput = document.createElement("input")
    idInput.type = "number"
    idInput.placeholder = "id"

    const usernameInput = document.createElement("input")
    usernameInput.type = "text"
    usernameInput.placeholder = "username"

    const ageInput = document.createElement("input")
    ageInput.type = "number"
    ageInput.placeholder = "age"

    const saveBtn = document.createElement("button")
    saveBtn.innerText = "Save"
    saveBtn.addEventListener("click", () => {
        const id = parseInt(idInput.value)
        const username = usernameInput.value
        const age = parseInt(ageInput.value)
        const data = {username, age, id}
        editUser(data)
        .then(response => response.text())
            .then(message => {
                alert(message)
            })
            .catch(error => {
                alert("An error occurred: " + error.message)
            })
    })

    resultContainer.append(text, idInput, usernameInput, ageInput, saveBtn)
}

document.addEventListener("DOMContentLoaded", async () => {
    const tokenStatus = await checkToken()
    if (tokenStatus === "invalid") {
        window.location.href = "index.html"
    } 

    const { username, age, role } = await getAccount()

    if (username) {
        document.getElementById("greeting").innerHTML = `Hello ${username}`
    }

    document.getElementById("logout").addEventListener("click", () => {
        logout()
    })

    document.getElementById("getAccount").addEventListener("click", () => {
        showUserInfo(username, age, role)
    })

    if (role === "admin") {
        document.getElementById("getUsers").style.display = "block"
        document.getElementById("deleteUser").style.display = "block"
        document.getElementById("editUser").style.display = "block"

        document.getElementById("getUsers").addEventListener("click", () => {
            showUsers()
        })

        document.getElementById("deleteUser").addEventListener("click", () => {  
            showDelete()      
        })

        document.getElementById("editUser").addEventListener("click", () => {
            showEdit()
        })
    } else if (role === "user"){
        //tähän voi lisätä vain userille tarkoitettuja tietoja tai viestejä
    } else {
        window.location.href = "index.html"
    }    
})