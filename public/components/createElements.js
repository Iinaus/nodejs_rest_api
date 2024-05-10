export function createButton(innerText, handleClick, className) {
    const button = document.createElement('button')
    button.innerText = innerText

    if(className){
        button.className = className
    }

    if(handleClick){
        button.addEventListener("click", () => {
            handleClick()
        })
    }

    return button
}

export function createParagraph(innerText) {
    const p = document.createElement('p')
    p.innerText = innerText
    
    return p
}

export function createInput(type, placeholder, id, value) {
    const input = document.createElement('input')
    input.type = type

    if(placeholder){
        input.placeholder = placeholder
    }

    if(id){
        input.id = id
    } 

    if(value){
        input.value = value
    } 

    return input
}

export function createTableCell(text, id) {
    const cell = document.createElement('td')
    
    if(text){
        cell.innerText = text
    }  
    
    if(id){
        cell.id = id
    }    
    return cell
}

export function createTableHeaderCell(text, id) {
    const cell = document.createElement('th')
    
    if(text){
        cell.innerText = text
    }

    if(id){
        cell.id = id
    }    
    return cell
}