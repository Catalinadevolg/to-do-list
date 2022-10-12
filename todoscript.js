const Body = document.querySelector("body");
const Input = document.querySelector(".input__text");
const InputBtn = document.querySelector('.input__btn');
const Active = document.querySelector('.active');
const Completed = document.querySelector('.completed');
const ActiveTasks = document.querySelector(".active-tasks-div");
const CompletedTasks = document.querySelector(".completed-tasks-div");
const Categories = document.querySelectorAll('.theme');
const colorModal = document.querySelector('.all-color');

let allActiveTextarea = [];
let allCompletedTextarea = [];
//let allColorModals = [];

const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
const completedArrray = JSON.parse(localStorage.getItem('completedTasks')) || [];


function addTask() {
    const inputValue = Input.value.replace(/^./, (a) => a[0].toUpperCase());
    let now = new Date().toLocaleString().slice(0,-3);
    const task = {
        name: inputValue,
        date: now,
        color: 'inherit'
    };
    
    tasks.push(task);

    saveChanges ();
    createActiveTasks(tasks);
    clearInput();
    localStorage.removeItem('input');
};

// DOM

function createActiveTasks(tasks) {
    ActiveTasks.innerHTML = tasks.map((item, index) => {
        return `<li class="task" draggable="true" data-index="${index}" name="${item.name}" style="background-color: ${item.color}">
        <div class="task-inside" data-title="Нажми enter">
            <input type="checkbox" id="accept-${index}" value="no" class="checkbox" data-index="${index}">
            <label for="accept-${index}" class="label-for-checkbox"></label>
            <textarea readonly class="title-task" data-index="${index}">${item.name}</textarea>
        </div>
        <p class="date-task">Последнее изменение: ${item.date}</p>
        </li>`;
    }).join('');

    const activeTextarea = document.querySelectorAll('.title-task');
    allActiveTextarea = activeTextarea;
    //const colorModals = document.querySelectorAll('.all-color');
    //allColorModals = colorModals;

    allActiveTextarea.forEach((item) => textareaHeight(item));
    resizeContentDiv(Active);
    setAttributeValue(tasks, ActiveTasks);
}

function createCompletedTasks() {
    CompletedTasks.innerHTML = completedArrray.map((item, index) => {
        return `<li class="completed-task" data-index-completed="${index}" name="${item.name}">
        <div class="completed-task-inside"><textarea readonly class="title-completed-task" data-index-completed="${index}">${item.name}</textarea>
        <div class="completed-remove-icon" data-index-remove-icon="${index}" data-title="Удалить задачу"></div></div>
        <p class="date-task">Дата завершения: ${item.date}</p>
        </li>`;
    }).join('');

    const allCTa = document.querySelectorAll('.title-completed-task');
    allCompletedTextarea = allCTa;

    allCompletedTextarea.forEach((item) => textareaHeight(item));
    resizeContentDiv(Completed);
    setAttributeValue(completedArrray, CompletedTasks);
};


// Input

InputBtn.addEventListener('click', () => {
    if (Input.value) {
        addTask();
    }
});
Input.addEventListener('keyup', function (e) {
    if (e.keyCode == 13 && Input.value) {
        addTask()
    };
});
function clearInput () {
    Input.value = "";
};


// accordion

const accordionBoxes = document.querySelectorAll('.accordion__box');
const BoxTitleClassName = "box-title";
const BoxTasksClassName = "box-tasks";
const ArrowClaccName = "arrow";
const AccordionHiddenBoxClassName = "accordion-hidden";
const ArrowTransfomClassName = "arrowTransform";

const smoothHeight = (items, boxTitle, boxContent, boxArrow, hiddenBox, arrowTransform) => {
    if (!items.length) return;

    items.forEach(item => {
        const title = item.querySelector(`.${boxTitle}`);
        const content = item.querySelector(`.${boxContent}`);
        const arrow = item.querySelector(`.${boxArrow}`);

        title.addEventListener('click', () => {
            if (content.classList.contains(hiddenBox)) {
                content.style.maxHeight = `${content.scrollHeight}px`;
                content.classList.remove(hiddenBox);
                arrow.classList.remove(arrowTransform);
            } else {
                content.style.maxHeight = '';
                content.classList.add(hiddenBox);
                arrow.classList.add(arrowTransform);
            }
        })
    })
}


// localstorage

function saveInputChanges() {
    localStorage.setItem('input', this.value);
}
function saveChanges() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('completedTasks', JSON.stringify(completedArrray));
}
function saveCategoryChanges(color, obj) {
    localStorage.setItem(`${color}`, JSON.stringify(obj));
}

Input.addEventListener('change', saveInputChanges);

function checkStorage() {
    Input.value = localStorage.getItem('input');
    for (let i = 0; i < Categories.length; i++) {
        let colorObjFromLS = JSON.parse(localStorage.getItem(`${Categories[i].getAttribute('name')}`));
        if (colorObjFromLS) {
            Categories[i].value = colorObjFromLS.categoryName;
        }
    }
}

function setAttributeValue (array, div) {
    if (array.length > 0) {
        div.setAttribute('data-title', '');
    }
}


// Resize

function resizeContentDiv (oneTasksBlock) {
    const content = oneTasksBlock.querySelector('.box-tasks');
    if (!content.classList.contains(AccordionHiddenBoxClassName)) {
        content.style.maxHeight = `${content.scrollHeight}px`;
    } else {
        return;
    }
}
function textareaHeight(element) {
    element.style.height = "1px";
    element.style.height = `${element.scrollHeight}px`;
}

function onResize() {
    allActiveTextarea.forEach((item) => textareaHeight(item));
    allCompletedTextarea.forEach((item) => textareaHeight(item));

    resizeContentDiv (Active);
    resizeContentDiv(Completed);
}
window.addEventListener('resize', onResize);


// tasks changes

function editTask(evt) {
    let currentTarget = evt.target;
    if (currentTarget.classList.contains('checkbox')) {

        if (currentTarget.hasAttribute('checked')) {
            currentTarget.removeAttribute('checked');
        } else {
            currentTarget.setAttribute('checked', 'true');
        }

    } else if (currentTarget.classList.contains('high-checkbox')) {

        const AllCheckbox = document.querySelectorAll('.checkbox');

        let onlyChecked = document.querySelectorAll('[checked="true"]');

        if (onlyChecked.length == 0) {
            for (i = AllCheckbox.length - 1; i >= 0; i--) {
                AllCheckbox[i].setAttribute('checked', 'true');
            }
            //AllCheckbox.forEach(item => item.setAttribute('checked', 'true'));
        } else {
            for (i = onlyChecked.length - 1; i >= 0; i--) {
                onlyChecked[i].removeAttribute('checked');
            }
            //onlyChecked.forEach(item => item.removeAttribute('checked'));
        }

    } else if (currentTarget.classList.contains('completed-icon')) {

        let checked = ActiveTasks.querySelectorAll('[checked="true"]');

        if (checked.length > 0) {
            for (i = checked.length - 1; i >= 0; i--) {
                let taskIndex = checked[i].getAttribute('data-index');
                let movingTaskArr = tasks.splice(taskIndex, 1);
                const movingTask = Object.assign({}, movingTaskArr[0]);
                movingTask.date = new Date().toLocaleString().slice(0,-3);
    
                completedArrray.push(movingTask);
            }
            saveChanges();
            createActiveTasks(tasks);
            createCompletedTasks();
        } else {
            alert('Ни одна задача не выбрана');
        }

    } else if (currentTarget.classList.contains('remove-icon')) {

        let checked = ActiveTasks.querySelectorAll('[checked="true"]');

        if (checked.length > 0) {
            let answer = confirm("Удалить выбранные задачи?");
            if (answer) {
                for (i = checked.length - 1; i >= 0; i--) {
                    let taskIndex = checked[i].getAttribute('data-index');
                    tasks.splice(taskIndex, 1);
                }

                saveChanges();
                createActiveTasks(tasks);
            }
        } else {
            alert('Ни одна задача не выбрана');
        }

    } else if (currentTarget.classList.contains('completed-remove-icon')) {

        let answer = confirm("Удалить выбранную задачу?");

        if (answer) {
            let taskIndex = currentTarget.getAttribute('data-index-remove-icon');
            completedArrray.splice(taskIndex, 1);

            saveChanges();
            createCompletedTasks();
        }

    } else if (currentTarget.classList.contains('color-icon')) {

        if (ActiveTasks.querySelector('[checked="true"]')) {
            colorModal.style.display = "flex";
            colorModal.addEventListener('click', (evt) => {
                changeColor(evt);
                saveChanges();
                createActiveTasks(tasks);
            });
            Body.addEventListener('click', (evt) => {
                if (!evt.target.closest('.all-color')) {
                    colorModal.style.display = "none";
                    Body.removeEventListener('click', editTask);
                }
            })
        } else {
            alert('Ни одна задача не выбрана');
        }

    } else if (currentTarget.classList.contains('color-circle')) {

        let filterColor = currentTarget.getAttribute('data-color');
        let alreadyFilter = document.querySelector('.filter');

        if (alreadyFilter && alreadyFilter != currentTarget) {
            alreadyFilter.classList.remove('filter');
        }

         let filterTasks = tasks.filter(function(val) {
            return val.color == filterColor;
          });

        if (filterTasks.length == 0) {
            alert ('Нет задач в данной категории');
        } else {
            if (currentTarget.classList.contains('filter')) {
                currentTarget.classList.remove('filter');
                createActiveTasks(tasks);
            } else {
                currentTarget.classList.add('filter');
                createActiveTasks(filterTasks);
                let allCheckbox = ActiveTasks.querySelectorAll('.label-for-checkbox');
                allCheckbox.forEach(item => {
                    item.style.display = 'none';
                })
            }
        }

    } else if (currentTarget.id == 'clearCompleted') {

        let answer = confirm("Действительно удалить все завершённые задачи?");

        if (answer) {
            completedArrray.length = 0;

            saveChanges();
            createCompletedTasks();

            setTimeout(() => alert('Завершённые задачи удалены'), 500);
        }

    }
}

function changeColor(evt) {
    if (evt.target.classList.contains('red-color')) {
        let color = 'rgba(250, 128, 114, 0.8)';
        changeTaskColor(color);
    } else if (evt.target.classList.contains('purple-color')) {
        let color = 'rgba(216, 191, 216, 0.8)';
        changeTaskColor(color);
    } else if (evt.target.classList.contains('blue-color')) {
        let color = 'rgba(148, 207, 208, 0.8)';
        changeTaskColor(color);
    } else if (evt.target.classList.contains('green-color')) {
        let color = 'rgba(67, 164, 126, 0.8)';
        changeTaskColor(color);
    } else if (evt.target.classList.contains('grey-color')) {
        let color = 'rgba(192, 192, 192, 0.8)';
        changeTaskColor(color);
    } else if (evt.target.classList.contains('inherit-color')) {
        let color = 'inherit';
        changeTaskColor(color);
    }

    function changeTaskColor (newColor) {
        let checked = ActiveTasks.querySelectorAll('[checked="true"]');
        for (let i = checked.length - 1; i >= 0; i--) {
            let taskIndex = checked[i].getAttribute('data-index');
            tasks[taskIndex].color = newColor;
            checked[i].removeAttribute('checked');
        }
        colorModal.style.display = "none";
    }
}


function editName(evt) {
    if (evt.target.classList.contains('title-task')) {
        let taskName = evt.target;
        editTaskName(taskName);
    } else if (evt.target.classList.contains('theme')) {
        let categoryName = evt.target;
        editCategoryName(categoryName);
    }
}

function editTaskName (taskName) {
    let taskIndex = taskName.getAttribute('data-index');
    let currentTextarea = allActiveTextarea[taskIndex];
    currentTextarea.removeAttribute('readonly');
    currentTextarea.style.backgroundColor = "white";
    
    currentTextarea.addEventListener('keydown', function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            currentTextarea.setAttribute('readonly', 'true');
            currentTextarea.style.backgroundColor = "inherit";
            
            tasks[taskIndex].name = currentTextarea.value;
            tasks[taskIndex].date = new Date().toLocaleString().slice(0,-3);
            
            saveChanges();
            createActiveTasks(tasks);
        };
    });
}

function editCategoryName(categoryName) {
    let categoryColor = categoryName.getAttribute('name');

    categoryName.removeAttribute('readonly');
    categoryName.style.backgroundColor = "white";

    categoryName.addEventListener('keydown', function(e) {
        if (e.keyCode === 13) {
            let categoryTextareaValue = categoryName.value;

            const categoryObj = {
                color: categoryColor,
                categoryName: categoryTextareaValue
            }

            categoryName.setAttribute('readonly', 'true');
            categoryName.style.backgroundColor = "inherit";

            saveCategoryChanges(categoryColor, categoryObj);
        }
    })
}

document.addEventListener('click', editTask);
document.addEventListener('dblclick', editName);

document.addEventListener('DOMContentLoaded', () => {
    accordionBoxes.forEach((item) => {
        resizeContentDiv (item);
    })
    smoothHeight(accordionBoxes, BoxTitleClassName, BoxTasksClassName, ArrowClaccName, AccordionHiddenBoxClassName, ArrowTransfomClassName);
});

checkStorage();
createActiveTasks(tasks);
createCompletedTasks();

