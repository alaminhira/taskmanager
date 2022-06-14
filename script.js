'use strict';
const _ = el => document.querySelector(el);
const taskBoxes = _('.task__boxes');
const lists = document.querySelectorAll('.task__list');
const items = document.querySelectorAll('.task__item');
const taskAdd = _('.task__add');
const taskField = _('.task__add-field');
const formInput = _('.task__add-input');

let data = 
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
    tasks.forEach(task => {
        _(`[data-list="${list}"]`).insertAdjacentHTML(
            'beforeend',
            `<li class="task__item" draggable="true">${task}</li>`
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
        this.querySelector('.task__item-status').classList.remove('hide');
    }
}

const dragEnd = function (e) {
    e.target.classList.remove('hold', 'hide');
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
    this.querySelector('.task__item-status').classList.add('hide');
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
        curEl.nextElementSibling.classList.add('show');
    } else if (curEl.classList.contains('task__add-cancel')) {

        curEl.parentNode.classList.remove('show');
        const curInpur = curEl.parentNode.querySelector('.task__add-input');
        curInpur.value = '';
    }

    if (curEl.classList.contains('task__add-create')) {
        const curInpur = curEl.parentNode.querySelector('.task__add-input');
        const value = curInpur.value;

        if (!value) return;

        curEl.closest('.task__add').previousElementSibling.insertAdjacentHTML(
            'beforeend',
            `<li class="task__item" draggable="true">${value}</li>`
        )
        curInpur.value = '';

        curEl.closest('.task__add').previousElementSibling.querySelector('.task__item-status').classList.add('hide');
    }
}

taskBoxes.addEventListener('click', addToTodo);