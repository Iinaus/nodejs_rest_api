export function getUsers() {
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