export function logout() {
    return fetch("/api/v1/user/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    }).then((response) => {
        if (response.ok) {
            window.location.href = "index.html"
        } else {
            return response.text().then((errorMessage) => {
                throw new Error(errorMessage);
            })
        }
    })
}