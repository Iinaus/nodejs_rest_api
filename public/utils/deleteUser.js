export function deleteUser(id) {
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