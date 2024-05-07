import { logout } from './utils/logout.js'
import { checkToken } from './utils/checkToken.js'
import { getUsers } from './utils/getUsers.js'
import { deleteUser } from './utils/deleteUser.js'

async function getAccount() {
    try {
        const response = await fetch("http://localhost:3000/api/v1/user/account")

        const { username, age, role } = await response.json()

        return { username, age, role }

    } catch (error){
        console.log(error)
    }    
}

async function listUsers() {
    try {
        const data = await getUsers()
        const list = document.createElement("div")
        list.innerHTML = data.map(user => `<ul>${user.id}, ${user.username}, ${user.age}, ${user.role}</ul>`)
        .join("")
        document.body.append(list)                
    } catch (error) {
        console.error("Virhe käyttäjien listauksessa:", error)
    }
}

function showUserInfo(username, age, role) {
    const userInfo = document.getElementById("userInfo")
    userInfo.innerHTML = `<ul>${username}, ${age}, ${role}</ul>`
    document.getElementById("userInfo").style.display = "block"
    document.getElementById("hideUserInfo").style.display = "block"
}

function hideUserInfo() {
    document.getElementById("userInfo").style.display = "none"
    document.getElementById("hideUserInfo").style.display = "none"
}

let showDeleteVisible = false
let deleteContainer = null

function showDelete() {
    if (!deleteContainer) {
        deleteContainer = document.createElement('div')
        deleteContainer.id = "deleteContainer"

        const text = document.createElement('p')
        text.innerText = "Write the ID of the user to be deleted."

        const deleteInput = document.createElement('input')
        deleteInput.type = "number"

        const closeBtn = document.createElement('button')
        closeBtn.innerText = "Close"
        closeBtn.addEventListener("click", () => {
            hideDelete()
        })

        const deleteBtn = document.createElement('button')
        deleteBtn.innerText = "Delete"
        deleteBtn.addEventListener("click", () => {
            const userId = deleteInput.value
            deleteUser(userId)
                .then(response => response.text())
                .then(message => {
                    alert(message)
                })
                .catch(error => {
                    alert("An error occurred: " + error.message)
                })
        })

        deleteContainer.append(text, deleteInput, deleteBtn, closeBtn)
        document.body.appendChild(deleteContainer)
    }

    deleteContainer.style.display = "block"
    showDeleteVisible = true
}

function hideDelete() {
    if (deleteContainer) {
        deleteContainer.remove()
        deleteContainer = null
        showDeleteVisible = false
    }
}

let showEditVisible = false
let editContainer = null

function showEdit() {
    if (!editContainer) {
        editContainer = document.createElement('div')
        editContainer.id = "editContainer"

        const text = document.createElement('p')
        text.innerText = "Write the ID of the user to be edited."

        const editInput = document.createElement('input')
        editInput.type = "number"

        const closeBtn = document.createElement('button')
        closeBtn.innerText = "Close"
        closeBtn.addEventListener("click", () => {
            hideEdit()
        })

        const editBtn = document.createElement('button')
        editBtn.innerText = "edit"

        editContainer.append(text, editInput, closeBtn)
        document.body.appendChild(editContainer)
    }

    editContainer.style.display = "block"
    showEditVisible = true
}

function hideEdit() {
    if (editContainer) {
        editContainer.remove()
        editContainer = null
        showEditVisible = false
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const tokenStatus = await checkToken()
    if (tokenStatus === "invalid") {
        window.location.href = "index.html"
    } 

    const { username, age, role } = await getAccount()

    document.getElementById("greeting").innerHTML = `Hello ${username}`

    document.getElementById("getAccount").addEventListener("click", () => {
        showUserInfo(username, age, role)
    })

    document.getElementById("hideUserInfo").addEventListener("click", () => {
        hideUserInfo()
    })

    document.getElementById("logout").addEventListener("click", () => {
        logout()
    })

    if (role === "admin") {
        document.getElementById("adminTools").style.display = "block"

        document.getElementById("getUsers").addEventListener("click", () => {
            listUsers()
        })

        document.getElementById("deleteUser").addEventListener("click", () => {
            if(!showDeleteVisible){
                showDelete()
            }           
        })

        document.getElementById("editUser").addEventListener("click", () => {
            if(!showEditVisible){
                showEdit()
            } 
        })

    } else if (role === "user"){
        const text = document.createElement('p')
        text.innerText = "Tämä näkyy usereille"
        document.body.append(text)
    } else {
        window.location.href = "index.html"
    }    
})