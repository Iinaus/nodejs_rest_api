import { logout } from './utils/logout.js'
import { checkToken } from './utils/checkToken.js'
import { getAccount, updateAge } from './services/userServices.js'
import { getUsers, deleteUser, editUser } from './services/adminServices.js'

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

async function showUserInfo() {
    if (resultContainer) {  
        hideResultContainer()
        createResultContainer()
    } else {
        createResultContainer()
    }

    const { username, age, role } = await getAccount()

    const tableContainer = document.createElement("div")
    const tableHTML = `
        <table>
            <thead>
            <tr>
                <th>Username</th>
                <th>Age</th>
                <th>Role</th>
            </tr>
            </thead>
            <tbody>
                <tr>
                <td>${username}</td>
                <td id="age">${age}</td>
                <td>${role}</td>
                </tr>
            </tbody>
        </table>
        `
    tableContainer.innerHTML = tableHTML

    const editBtn = document.createElement("button")
    editBtn.innerText = "Edit"
    editBtn.addEventListener("click", () => {  
        editBtn.style.display = "none"
        
        const cancelBtn = document.createElement("button")
        cancelBtn.innerText = "Cancel"
        cancelBtn.addEventListener("click", () => {
            ageCell.innerHTML = null
            ageCell.innerText = currentAge
            resultContainer.removeChild(cancelBtn)
            resultContainer.removeChild(saveBtn)
            resultContainer.append(editBtn)
        })

        const ageCell = document.getElementById("age")
        const currentAge = ageCell.innerText
        const ageInput = document.createElement("input")

        ageInput.type = "number"
        ageInput.id = "ageInput"
        ageInput.value = currentAge
        ageCell.innerText = ""

        ageCell.appendChild(ageInput)       

        const saveBtn = document.createElement("button")
        saveBtn.innerText = "Save"
        saveBtn.addEventListener("click", () => {
            const age = parseInt(ageInput.value)
            const data = {age}
            updateAge(data)
            ageCell.innerHTML = null
            ageCell.innerText = age
            resultContainer.removeChild(cancelBtn)
            resultContainer.removeChild(saveBtn)
            resultContainer.append(editBtn)
        })
        resultContainer.append(cancelBtn, saveBtn)
    })
    resultContainer.append(tableContainer, editBtn)
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
        const tableContainer = document.createElement("div")        
        const tableHTML = `
        <table>
            <thead>
            <tr>
                <th>Id</th>
                <th>Username</th>
                <th>Age</th>
                <th>Role</th>
            </tr>
            </thead>
            <tbody>
            ${data.map(user => `
                <tr>
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.age}</td>
                <td>${user.role}</td>
                </tr>
            `).join('')}
            </tbody>
        </table>
        `
        tableContainer.innerHTML = tableHTML
        resultContainer.append(tableContainer)
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

    const roleInput = document.createElement("select")
    const option1 = document.createElement("option")
    
    option1.text = "user"
    roleInput.add(option1)

    const option2 = document.createElement("option")
    option2.text = "admin"
    roleInput.add(option2)

    const saveBtn = document.createElement("button")
    saveBtn.innerText = "Save"
    saveBtn.addEventListener("click", () => {
        const id = parseInt(idInput.value)
        const username = usernameInput.value
        const age = parseInt(ageInput.value)
        const role = roleInput.value
        const data = {username, age, id, role}
        editUser(data)
    })

    resultContainer.append(text, idInput, usernameInput, ageInput, roleInput, saveBtn)
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