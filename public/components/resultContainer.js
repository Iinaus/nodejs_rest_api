export function createResultContainer() {  
    //resultContainer = document.createElement("div")
    //resultContainer.id = "resultContainer"
    //resultContainer.className = "container"

    const resultContainer = document.getElementById("resultContainer")

    const closeBtn = document.createElement("button")
    closeBtn.innerText = "Close"
    closeBtn.className = "close-button"
    closeBtn.addEventListener("click", () => {
        hideResultContainer()
    })

    resultContainer.append(closeBtn)
    resultContainer.style.display = "block"
    document.body.appendChild(resultContainer)  
    ///showResultVisible = true
}

export function hideResultContainer() {
    const resultContainer = document.getElementById("resultContainer")

    if (resultContainer) {
        resultContainer.remove()
        resultContainer = null
        //showResultVisible = false
    }
}