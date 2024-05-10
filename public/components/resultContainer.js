import { createButton } from './createElements.js'

let showResultVisible = false
let resultContainer = null

function createResultContainer() {  
    resultContainer = document.createElement("div")
    resultContainer.id = "resultContainer"
    resultContainer.className = "container"

    const closeBtn = createButton("Close", null, "close-button")
    closeBtn.addEventListener("click", () => {
        hideResultContainer()
    })

    resultContainer.append(closeBtn)
    resultContainer.style.display = "block"
    document.body.append(resultContainer)  
    showResultVisible = true
}

function hideResultContainer() {
    if (resultContainer) {
        resultContainer.remove()
        resultContainer = null
        showResultVisible = false
    }
}

export function checkResultContainer(){
    if (resultContainer) {  
        hideResultContainer()
        createResultContainer()
    } else {
        createResultContainer()
    }
}