import { logout } from './utils/logout.js'
import { checkToken } from './utils/checkToken.js'
import { getAccount, updateAge } from './services/userServices.js'
import { getUsers, deleteUser, editUser } from './services/adminServices.js'
import { checkResultContainer } from './components/resultContainer.js'
import { createButton, createInput, createParagraph, createTableCell, createTableHeaderCell} from './components/createElements.js'

async function showUserInfo() {    

    checkResultContainer()

    function handleEdit() {
        function handleCancel() {
            ageCell.innerText = currentAge
            resultContainer.removeChild(cancelBtn)
            resultContainer.removeChild(saveBtn)
            editBtn.style.display = "block"
            resultContainer.append(editBtn)
        }

        function handleSave() {
            const age = parseInt(ageInput.value)
            const data = {age}
            updateAge(data)
            ageCell.innerText = age
            resultContainer.removeChild(cancelBtn)
            resultContainer.removeChild(saveBtn)
            editBtn.style.display = "block"
            resultContainer.append(editBtn)
        }
        
        editBtn.style.display = "none"

        const cancelBtn = createButton("Cancel", handleCancel)
        const saveBtn = createButton("Save", handleSave)

        const ageCell = document.getElementById("age")
        const currentAge = ageCell.innerText
        const ageInput = createInput("number", null, "ageInput" , currentAge)
        ageCell.innerText = ""

        ageCell.append(ageInput)  
        resultContainer.append(cancelBtn, saveBtn)
    }

    const { username, age, role } = await getAccount()

    const editBtn = createButton("Edit", handleEdit)
    
    const table = document.createElement('table')
    const thead = document.createElement('thead')
    const tbody = document.createElement('tbody')
    const trHeaders = document.createElement('tr')
    const trBody = document.createElement('tr')

    const thUsername = createTableHeaderCell("Username")
    const thAge = createTableHeaderCell("Age")
    const thRole = createTableHeaderCell("Role")    

    const tdUsername = createTableCell(username)
    const tdAge = createTableCell(age, "age")
    const tdRole = createTableCell(role)    

    trHeaders.append(thUsername, thAge, thRole)
    trBody.append(tdUsername, tdAge, tdRole)
    tbody.append(trBody)
    thead.append(trHeaders)
    table.append(thead, tbody)    

    resultContainer.append(table, editBtn)
}

async function showUsers() {
    
    checkResultContainer()

    try {
        const data = await getUsers()
        const tableContainer = document.createElement("div")        
        const table = document.createElement('table')
        const thead = document.createElement('thead')
        const tbody = document.createElement('tbody')
        const trHeaders = document.createElement('tr')

        const thId = createTableHeaderCell("Id")
        const thUsername = createTableHeaderCell("Username")
        const thAge = createTableHeaderCell("Age")
        const thRole = createTableHeaderCell("Role")  

        trHeaders.append(thId, thUsername, thAge, thRole)

        data.map(user => {
            const trBody = document.createElement('tr')
            const tdId = createTableCell(user.id)
            const tdUsername = createTableCell(user.username)
            const tdAge = createTableCell(user.age)
            const tdRole = createTableCell(user.role) 
            
            trBody.append(tdId, tdUsername, tdAge, tdRole)
            tbody.append(trBody)
        })
        
        thead.append(trHeaders)
        table.append(thead, tbody)
        tableContainer.append(table)

        resultContainer.append(tableContainer)

    } catch (error) {
        console.error("Virhe käyttäjien listauksessa:", error)
    }  
}

function showDelete() {
    
    checkResultContainer()

    function handleDelete() {
        const id = deleteInput.value
        if (id) {
            deleteUser(id)
            deleteInput.value = ""
        } else {
            alert("User ID cannot be empty!")
        }
    }

    const text = createParagraph("Write the ID of the user to be deleted.")
    const deleteInput = createInput("number", "id")
    const deleteBtn = createButton("Delete", handleDelete)

    resultContainer.append(text, deleteInput, deleteBtn)
}

function showEdit() {
    
    checkResultContainer()

    function handleSave() {
        const id = parseInt(idInput.value)
        const username = usernameInput.value
        const age = parseInt(ageInput.value)
        const role = roleInput.value
        const data = {username, age, id, role}
        editUser(data)
        idInput.value = ""
        usernameInput.value = ""
        ageInput.value = ""
    }

    const text = createParagraph("Write the ID of the user to be edited and add new username and age.")
    const saveBtn = createButton("Save", handleSave)
    const idInput = createInput("number", "id")
    const usernameInput = createInput("text", "username")
    const ageInput = createInput("number", "age")

    const roleInput = document.createElement("select")
    const option1 = document.createElement("option")
    option1.text = "user"
    roleInput.add(option1)
    const option2 = document.createElement("option")
    option2.text = "admin"
    roleInput.add(option2)    

    resultContainer.append(text, idInput, usernameInput, ageInput, roleInput, saveBtn)
}

document.addEventListener("DOMContentLoaded", async () => {
    const tokenStatus = await checkToken()
    if (tokenStatus === "invalid") {
        window.location.href = "index.html"
    } 

    const { username, age, role } = await getAccount()

    if (username) {
        document.getElementById("greeting").innerText = `Hello ${username}`
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