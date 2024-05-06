export function login(credentials) {
    return fetch("/api/v1/user/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
    }).then((response) => {
        if (response.ok) {
            window.location.href = "dashboard.html"
        } else {
            return response.text().then((errorMessage) => {
                throw new Error(errorMessage);
            })
        }
    })
}