import {STATUS_CODE, TAB_ID} from './constants.js';

var counter = 0;
var tasks = {};

function addTask(title) {
    tasks[`task-${counter}`] = {
        id: counter++, 
        title: title,
        status: STATUS_CODE.PENDING,
    };
}

function createTaskListItem(task) {
    let taskListItem = document.createElement('LI');
    taskListItem.setAttribute('id', `task-${task.id}`);
    taskListItem.setAttribute('class', 'task-list-item');
    taskListItem.addEventListener('click', ev => {
        if (ev.target.id === 'delete-task-btn') {
            delete tasks[ev.target.parentNode.parentNode.id];
        }
        else if (ev.currentTarget.nodeName === 'LI') {
            toggleTaskStatus(tasks[ev.currentTarget.id]);
        }
        updateTaskList();
    });

    let div = document.createElement('DIV');
    div.setAttribute('class', 'task-container');
    taskListItem.appendChild(div);

    let div2 = document.createElement('DIV');
    div2.setAttribute('class', 'task-container-text');
    let text = document.createTextNode(`${task.title}`);
    if (task.status === STATUS_CODE.COMPLETED) {
        let tickImg = document.createElement('IMG');
        tickImg.setAttribute('id', 'tick-mark');
        tickImg.setAttribute('src', '/public/media/tick-mark.png');
        tickImg.setAttribute('class', 'tick-mark');
        div2.appendChild(tickImg);
        let del = document.createElement('DEL');
        del.appendChild(text);
        div2.appendChild(del);
    }
    else {
        div2.appendChild(text)
    }
    div.appendChild(div2);

    let crossImg = document.createElement('IMG');
    crossImg.setAttribute('id', 'delete-task-btn')
    crossImg.setAttribute('src', '/public/media/delete.ico');
    crossImg.setAttribute('class', 'delete-task-btn');
    div.appendChild(crossImg);

    return taskListItem;
}

function toggleTaskStatus(task) {
    if (task.status === STATUS_CODE.PENDING) {
        task.status = STATUS_CODE.COMPLETED;
    }
    else {
        task.status = STATUS_CODE.PENDING;
    }
}

function updateTaskList() {
    let [selectedTab] = document.getElementsByClassName('tab-selected');
    let selectedTabID = selectedTab.id;
    let taskList = document.querySelector('#task-list');
    taskList.innerHTML = '';
    Object.values(tasks).forEach(task => {
        let condition = (
            selectedTabID === TAB_ID.ALL
             || (selectedTabID === TAB_ID.PENDING && task.status === STATUS_CODE.PENDING)
             || (selectedTabID === TAB_ID.COMPLETED && task.status === STATUS_CODE.COMPLETED)
        );
        if (condition) {
            let taskItem = createTaskListItem(task);
            taskList.appendChild(taskItem);
        }
    });
}

document.querySelector('#add-task-btn').addEventListener('click', ev => {
    addTask(document.querySelector('#add-task-text').value);
    updateTaskList();
});

document.querySelector('#nav-tabs').addEventListener('click', ev => {
    let [prevSelectedTab] = document.getElementsByClassName('tab-selected');
    prevSelectedTab.classList.remove('tab-selected');
    ev.target.classList.add('tab-selected');
    updateTaskList();
});

document.addEventListener('keypress', ev => {
    if (ev.key === 'Enter') {
        document.querySelector('#add-task-btn').click();
    }
});