const inputBox = document.querySelector('#input-box')
const listContainer = document.querySelector('#list-container')
const addBtn = document.querySelector('#add-btn')

function addTask (value) {
    if(value == '') {
        alert("You must write something!!")
    } else {
        let li = document.createElement('li')
        li.innerHTML = value
        listContainer.appendChild(li)
        let span = document.createElement('span')
        span.innerHTML = '\u00d7'
        li.appendChild(span)
    }
    inputBox.value = ''
    saveData()
}

addBtn.onclick = function() {
    addTask(inputBox.value)
}

listContainer.addEventListener('click', function(e) {
    if(e.target.tagName === 'LI') {
        e.target.classList.toggle("checked")
        saveData()
    } else if(e.target.tagName === 'SPAN') {
        e.target.parentElement.remove()
        saveData()
    }
}, false)

function saveData() {
    localStorage.setItem('data', listContainer.innerHTML)
}

function showTask() {
    listContainer.innerHTML = localStorage.getItem('data')
}

showTask()