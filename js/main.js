const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

// массив, в котором будут храниться все задачи
let tasks = [];

if(localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach(function (task) {
        renderTask(task);
    })
}



checkEmptyList();

// Добавление задачи
form.addEventListener('submit', addTask);

function addTask(event) {
    // Отменяем отправку формы
    // метод preventDefault отменяет стандартное поведение страницы (без него страница сразу же обновляется)
    event.preventDefault()
    
    // Достаем текст задачи из поля ввода
    const taskText = taskInput.value

    // Описываем задачу в виде объекта
    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false,
    }

    // Добавляем задачу в массив с задачами
    // метод push() добавляет элемент в конец массива
    tasks.push(newTask) 

    // добавляем задание в Local Storage
    saveToLocalStorage();

    renderTask(newTask);

    // Очищаем поле ввода и возвращаем ему фокус
    taskInput.value = ""
    taskInput.focus()

    // удаление плашки "Cgbcjr дел пуст" при добавлении задачи
    // метод children возвращает коллекцию элементов, которые находяться внутри 
    // if(tasksList.children.length > 1) {
    //     emptyList.classList.add('none')
    // }
    checkEmptyList();
}

// Удаление задачи
tasksList.addEventListener('click', deleteTask)

function deleteTask(event) {
    // Проверяем если клик был НЕ по кнопке "удалить задачу"
	if (event.target.dataset.action !== 'delete') return;
    // находим родителя кнопки (карточку задачи)
    const parentNode = event.target.closest('.list-group-item');

    // определяем ID задачи
    const id = Number(parentNode.id);

    // находим индекс задачи в массиве
    const index = tasks.findIndex(function (task) {
        if (task.id === id) {
            return true;
        }
    })

    // убираем задачу из массива
    tasks.splice(index, 1)

    saveToLocalStorage();
    // удаление задачи из разметки
    parentNode.remove();

    // прверка. Если в списке задач больше одного элемента, плказывать "Список дел пуст"
    // if(tasksList.children.length === 1) {
    //     emptyList.classList.remove('none');
    // }
    checkEmptyList();
}

// Отмечаем задачу выполненной 
tasksList.addEventListener('click', doneTask)

function doneTask(event) {
    if (event.target.dataset.action === 'done') {
        const parentNode = event.target.closest('.list-group-item');

        const id = Number(parentNode.id);
        const task = tasks.find(function (task) {
            if (task.id === id) {
                return true
            }
        })

        task.done = !task.done

        saveToLocalStorage();

        const taskTitle = parentNode.querySelector('.task-title');
        taskTitle.classList.toggle('task-title--done');
    }
}

function checkEmptyList() {
    if(tasks.length === 0) {
        const emptyListHTML = `
        <li id="emptyList" class="list-group-item empty-list">
            <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
            <div class="empty-list__title">Список дел пуст</div>
        </li>`
        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
    }

    if(tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    }
}

function saveToLocalStorage(task) {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask(task) {
    // Формируем CSS класс 
    const cssClass = task.done ? "task-title task-title--done" : "task-title";

    // Формируем разметку для новой задачи
    const taskHTML = `
    <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
        <span class="${cssClass}">${task.text}</span>
        <div class="task-item__buttons">
            <button type="button" data-action="done" class="btn-action">
                <img src="./img/tick.svg" alt="Done" width="18" height="18">
            </button>
            <button type="button" data-action="delete" class="btn-action">
                <img src="./img/cross.svg" alt="Done" width="18" height="18">
            </button>
        </div>
    </li>`;

    // Добавляем задачц на страницу 
    tasksList.insertAdjacentHTML('beforeend', taskHTML);
}
