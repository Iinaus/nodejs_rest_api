export async function getAccount() {
    try {
        const response = await fetch("http://localhost:3000/api/v1/user/account")

        const { username, age, role } = await response.json()

        return { username, age, role }

    } catch (error){
        console.log(error)
    }    
}

export async function updateAge(data) {
    updateAgeFromDB(data)
        .then(response => response.text())
            .then(message => {
                alert(message)
            })
            .catch(error => {
                alert("An error occurred: " + error.message)
            })
}

function updateAgeFromDB(data) {
    return fetch("api/v1/user", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }).then((response) => {
        if (response.ok) {
            return response
        } else {
            return response.text().then((errorMessage) => {
                throw new Error(errorMessage)
            })
        }
    })
}