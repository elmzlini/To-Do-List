document.addEventListener('DOMContentLoaded', function () {
    // Charger les tâches et le thème au démarrage
    loadTasks();
    loadTheme();

    // Écouteurs d'événements
    document.getElementById('addTaskBtn').addEventListener('click', addTask);
    document.getElementById('taskInput').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    document.getElementById('themeToggleBtn').addEventListener('click', toggleTheme);
    document.getElementById('filterCategory').addEventListener('change', filterTasksByCategory);
});

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    const taskCategory = document.getElementById('taskCategory').value;
    const taskDate = document.getElementById('taskDate').value;

    if (taskText !== '') {
        const taskList = document.getElementById('taskList');
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';

        li.innerHTML = `
            <span>${taskText}</span>
            <div>
                <span class="badge bg-primary me-2">${taskCategory}</span>
                <span class="badge bg-secondary me-2">${taskDate}</span>
                <button class="btn btn-sm btn-outline-success me-2 edit-btn">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger delete-btn">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        // Ajouter des écouteurs pour les boutons de suppression et d'édition
        li.querySelector('.delete-btn').addEventListener('click', function () {
            deleteTask(li);
        });

        li.querySelector('.edit-btn').addEventListener('click', function () {
            editTask(li);
        });

        // Marquer la tâche comme complétée
        li.addEventListener('click', function () {
            li.classList.toggle('completed');
            saveTasks();
            updateTaskCounter();
        });

        taskList.appendChild(li);
        taskInput.value = '';
        saveTasks();
        updateTaskCounter();
        showNotification(`Tâche ajoutée : ${taskText}`);
    }
}

function deleteTask(li) {
    li.classList.add('fade-out');
    setTimeout(() => {
        li.remove();
        saveTasks();
        updateTaskCounter();
    }, 300);
}

function editTask(li) {
    const taskText = li.querySelector('span').textContent;
    const taskCategory = li.querySelector('.badge.bg-primary').textContent;
    const taskDate = li.querySelector('.badge.bg-secondary').textContent;

    const newText = prompt('Modifier la tâche :', taskText);
    const newCategory = prompt('Modifier la catégorie :', taskCategory);
    const newDate = prompt('Modifier la date :', taskDate);

    if (newText !== null && newText.trim() !== '') {
        li.querySelector('span').textContent = newText.trim();
        li.querySelector('.badge.bg-primary').textContent = newCategory;
        li.querySelector('.badge.bg-secondary').textContent = newDate;
        saveTasks();
    }
}

function filterTasksByCategory() {
    const selectedCategory = document.getElementById('filterCategory').value;
    const tasks = document.querySelectorAll('#taskList li');

    tasks.forEach(task => {
        const taskCategory = task.querySelector('.badge.bg-primary').textContent;
        if (selectedCategory === 'Toutes' || taskCategory === selectedCategory) {
            task.style.display = 'flex';
        } else {
            task.style.display = 'none';
        }
    });
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    themeToggleBtn.innerHTML = document.body.classList.contains('dark-mode') 
        ? '<i class="fas fa-sun"></i> Mode Clair' 
        : '<i class="fas fa-moon"></i> Mode Sombre';
    saveTheme();
}

function saveTheme() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
}

function loadTheme() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('themeToggleBtn').innerHTML = '<i class="fas fa-sun"></i> Mode Clair';
    }
}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll('#taskList li').forEach(li => {
        tasks.push({
            text: li.querySelector('span').textContent,
            category: li.querySelector('.badge.bg-primary').textContent,
            date: li.querySelector('.badge.bg-secondary').textContent,
            completed: li.classList.contains('completed')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';

        li.innerHTML = `
            <span>${task.text}</span>
            <div>
                <span class="badge bg-primary me-2">${task.category}</span>
                <span class="badge bg-secondary me-2">${task.date}</span>
                <button class="btn btn-sm btn-outline-success me-2 edit-btn">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger delete-btn">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        if (task.completed) {
            li.classList.add('completed');
        }

        // Ajouter des écouteurs pour les boutons de suppression et d'édition
        li.querySelector('.delete-btn').addEventListener('click', function () {
            deleteTask(li);
        });

        li.querySelector('.edit-btn').addEventListener('click', function () {
            editTask(li);
        });

        // Marquer la tâche comme complétée
        li.addEventListener('click', function () {
            li.classList.toggle('completed');
            saveTasks();
            updateTaskCounter();
        });

        document.getElementById('taskList').appendChild(li);
    });
    updateTaskCounter();
}

function updateTaskCounter() {
    const tasks = document.querySelectorAll('#taskList li:not(.completed)').length;
    document.getElementById('taskCounter').textContent = `Tâches restantes : ${tasks}`;
}

function showNotification(message) {
    if (Notification.permission === 'granted') {
        new Notification('To-Do List', {
            body: message,
            icon: 'icon.png'
        });
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification('To-Do List', {
                    body: message,
                    icon: 'icon.png'
                });
            }
        });
    }
}