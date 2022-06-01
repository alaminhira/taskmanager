'use strict';
const lists = document.querySelectorAll('.task__list');
const items = document.querySelectorAll('.task__item');

let curId = null;
const dragStart = function(e) {
    this.classList.add('hold');
    curId = e.target.parentNode.dataset.id
    setTimeout(() => this.classList.add('hide'), 0);
}

const dragEnd = function() {
    this.classList.remove('hold');
}

const dragOver = (e) => e.preventDefault();

const dragEnter = function(e) {
    e.preventDefault();

    if (this.dataset.id === curId) return;
    
    this.classList.add('hovered');
}

const dragLeave = () => lists.forEach(l => l.classList.remove('hovered'));

const dragDrop = function(e) {
    const itemHold = document.querySelector('.hold');
    itemHold.classList.remove('hide');
    this.appendChild(itemHold);
    this.classList.remove('hovered');
}

items.forEach(item => {
    item.addEventListener('dragstart', dragStart);
    item.addEventListener('dragend', dragEnd);
})

lists.forEach((list, i) => {
    list.setAttribute('data-id', i);

    list.addEventListener('dragover', dragOver);
    list.addEventListener('dragenter', dragEnter);
    list.addEventListener('dragleave', dragLeave);
    list.addEventListener('drop', dragDrop);
})