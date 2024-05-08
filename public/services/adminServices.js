export async function getUsers() {
    return fetch("/api/v1/user", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    }).then((response) => {
        if (response.ok) {
            return response.json()
        } else {
            return response.text().then((errorMessage) => {
                throw new Error(errorMessage)
            })
        }
    })
}

export async function deleteUser(id) {
    deleteUserFromDB(id)
        .then(response => response.text())
        .then(message => {
            alert(message)
        })
        .catch(error => {
            alert("An error occurred: " + error.message)
        })
}


function deleteUserFromDB(id) {
    return fetch(`/api/v1/user/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
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

export async function editUser(data) {
    editUserFromDB(data)
        .then(response => response.text())
            .then(message => {
                alert(message)
            })
            .catch(error => {
                alert("An error occurred: " + error.message)
            })
}

function editUserFromDB(data) {
    return fetch("api/v1/user", {
        method: "PUT",
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