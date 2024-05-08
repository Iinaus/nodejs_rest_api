export function editUser(data) {
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