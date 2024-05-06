async function getUser() {
    try {
        const response = await fetch("http://localhost:3000/api/v1/user/account")

        const data = await response.json()

        const { username, age, role } = data
        const text = document.createElement("p")
        text.innerHTML = `Hello ${username} ${age} ${role}`

        console.log(data)
        document.body.append(text)

        return role

    } catch (error){
        console.log(error)
    }    
}

document.addEventListener("DOMContentLoaded", async () => {
    const role = await getUser()

    const text = document.createElement("p")

    if (role === "admin") {
        text.innerHTML = `Tämä näkyy vain adminille`
        const listAllUsersBtn = document.createElement("button")
        listAllUsersBtn.innerText = "Katso kaikki käyttäjät"

        const deleteUserBtn = document.createElement("button")
        deleteUserBtn.innerText = "Poista käyttäjä"

        const editUserBtn = document.createElement("button")
        editUserBtn.innerText = "Muokkaa käyttäjää"

        document.body.append(listAllUsersBtn, deleteUserBtn, editUserBtn)
    } else if (role === "user"){
        text.innerHTML = `Tämä näkyy usereille`
    } else {
        text.innerHTML = `Tämä näkyy kirjautumattomille`
    }

    document.body.append(text)
})