'use strict';
const _ = el => document.querySelector(el);
const taskBoxes = _('.task__boxes');
const lists = document.querySelectorAll('.task__list');
const taskAddFields = document.querySelectorAll('.task__add-field');

let data = null;
(function () {
    const request = new XMLHttpRequest();
    request.open('GET', 'tasks.json');
    request.send();

    request.addEventListener('load', function () {
        data = JSON.parse(this.responseText);
        const ids = [...lists].map(l => l.dataset.list);

        for (const [prop, vals] of Object.entries(data)) {
            if (vals.length < 1) renderStatus(prop, data.status);

            ids.forEach(id => {
                if (prop === id) renderTask(prop, vals)
            })
        }
    })
})();

const renderTask = function (list, tasks) {

    [].concat(tasks).forEach(task => {
        _(`[data-list="${list}"]`).insertAdjacentHTML(
            'beforeend',
            `<li class="task__item" draggable="true">
                <div class="task__item-icons">
                    <i class="fas fa-edit"></i>
                    <i class="fas fa-trash"></i>
                </div>
                <p contenteditable="false">${task}</p>
            </li>
            `
        );
    })
}

const renderStatus = function (list, status) {
    const curList = _(`[data-list="${list}"]`);
    if (curList.querySelector('.task__item-status')) return;
    
    curList.insertAdjacentHTML(
        'beforeend',
        `<li class="task__item-status">${status}</li>`
    );
}

let curId = null, childCount;
const dragStart = function (e) {
    e.target.classList.add('hold');
    curId = e.target.parentNode.dataset.id
    setTimeout(() => e.target.classList.add('hide'), 0);

    childCount = this.querySelectorAll('.task__item').length;

    if (childCount - 1 < 1) {
        renderStatus(this.dataset.list, data.status)
        this.querySelector('.task__item-status')?.classList.remove('hide');
    }
}

const dragEnd = function (e) {
    e.target.classList.remove('hold', 'hide');
    this.querySelector('.task__item-status')?.classList.add('hide');
}

const dragOver = (e) => e.preventDefault();

const dragEnter = function (e) {
    e.preventDefault();

    if (this.dataset.id === curId) return;

    this.classList.add('hovered');
}

const dragLeave = () => lists.forEach(l => l.classList.remove('hovered'));

const dragDrop = function (e) {
    const itemHold = document.querySelector('.hold');
    this.appendChild(itemHold);
    this.classList.remove('hovered');
}

lists.forEach((list, i) => {
    list.setAttribute('data-id', i);

    list.addEventListener('dragstart', function(e) {
        const li = document.querySelector('.list__item');
        if (e.target !== li) return;
    });
    
    list.addEventListener('dragstart', dragStart);
    list.addEventListener('dragend', dragEnd);
    list.addEventListener('dragover', dragOver);
    list.addEventListener('dragenter', dragEnter);
    list.addEventListener('dragleave', dragLeave);
    list.addEventListener('drop', dragDrop);
})

const addToTodo = function (e) {
    const curEl = e.target;

    if (curEl.classList.contains('task__add-btn')) {
        taskAddFields.forEach(f => f.classList.remove('show'));
        curEl.nextElementSibling.classList.add('show');
    } else if (
        curEl.classList.contains('task__add-cancel') ||
        e.keyCode === 27
    ) {
        curEl.parentNode.classList.remove('show');
        const curInpur = curEl.parentNode.querySelector('.task__add-input');
        curInpur.value = '';
    }

    if (
        curEl.classList.contains('task__add-create') || 
        e.keyCode === 13
    ) {
        const curInpur = curEl.parentNode.querySelector('.task__add-input');
        const value = curInpur.value;

        if (!value) return;

        const curListId = curEl.closest('.task__add').previousElementSibling.dataset.list;

        renderTask(curListId, value);

        curInpur.value = '';

        curEl.parentNode.classList.remove('show');
        curEl.closest('.task__add').previousElementSibling.querySelector('.task__item-status')?.classList.add('hide');
    }
}

const manipulateTask = function (e) {
    let curIcon = e.target;
    if (curIcon.classList.contains('fa-edit')) {
        curIcon.closest('.task__item').querySelector('p').contentEditable = "true";
    } else {
        curIcon.closest('.task__item').querySelector('p').contentEditable = "false";
    }
} 

taskBoxes.addEventListener('click', addToTodo);
document.addEventListener('keydown', addToTodo);
taskBoxes.addEventListener('click', manipulateTask);
