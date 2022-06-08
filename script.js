'use strict';
const lists = document.querySelectorAll('.task__list');
const item = document.querySelector('.task__item');
const formInput = document.querySelector('.task__form-input');
const form = document.querySelector('.task__form');

let curId = null;
const dragStart = function(e) {
    if (!e.target.classList.contains('task__item')) return;

    e.target.classList.add('hold');
    curId = e.target.parentNode.dataset.id
    setTimeout(() => e.target.classList.add('hide'), 0);
}

const dragEnd = function(e) {
    e.target.classList.remove('hold', 'hide');
    // e.target.classList.remove('hide');
}

const dragOver = e => e.preventDefault();

const dragEnter = function(e) {
    e.preventDefault();
    if (this.dataset.id === curId) return;
    
    this.classList.add('hovered');
}

const dragLeave = function() {
    lists.forEach(l => l.classList.remove('hovered'));
};

const dragDrop = function(e) {
    const itemHold = document.querySelector('.hold');
    this.appendChild(itemHold);
    this.classList.remove('hovered');
}

lists.forEach((list, i) => {
    list.setAttribute('data-id', i);

    list.addEventListener('dragstart', dragStart);
    list.addEventListener('dragend', dragEnd);
    list.addEventListener('dragover', dragOver);
    list.addEventListener('dragenter', dragEnter);
    list.addEventListener('dragleave', dragLeave);
    list.addEventListener('drop', dragDrop);
})

const addToTodo = function(e) {
    e.preventDefault();
    
    document.querySelector('.task__list--todo').insertAdjacentHTML(
        'beforeend',
        `<li class="task__item" draggable="true">${formInput.value}</li>`
    );

    formInput.value = '';
}

form.addEventListener('submit', addToTodo);
