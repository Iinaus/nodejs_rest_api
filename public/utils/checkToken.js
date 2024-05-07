export function checkToken() {
    return fetch("/checkToken", {
        method: "POST",
        credentials: "same-origin"
    })
    .then(response => {
        if (response.ok) {
            return "valid"
        } else {
            return "invalid"
        }
    })
    .catch(error => {
        console.error("Virhe tarkistaessa tokenia:", error)
        return "invalid"
    })
}