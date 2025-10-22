// --- OBSERVER PATTERN ---
// The View implements the `update` method, which is called by the Subject (TodoService)
// whenever the data changes.

class View {
    constructor() {
        this.input = document.getElementById('todo-input');
        this.addButton = document.getElementById('add-todo-btn');
        this.todoList = document.getElementById('todo-list');
    }

    // This method is called by the service to re-render the UI
    update(todos) {
        this.todoList.innerHTML = ''; // Clear the list
        todos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            li.dataset.id = todo.id;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = todo.completed;

            const text = document.createElement('span');
            text.className = 'todo-text';
            text.textContent = todo.text;

            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-btn';
            deleteButton.textContent = 'Delete';

            li.append(checkbox, text, deleteButton);
            this.todoList.appendChild(li);
        });
    }

    bindAddTodo(handler) {
        this.addButton.addEventListener('click', () => {
            handler(this.input.value);
            this.input.value = ''; // Clear input after adding
        });
    }

    bindToggleTodo(handler) {
        this.todoList.addEventListener('click', event => {
            if (event.target.type === 'checkbox') {
                const id = parseInt(event.target.parentElement.dataset.id);
                handler(id);
            }
        });
    }

    bindRemoveTodo(handler) {
        this.todoList.addEventListener('click', event => {
            if (event.target.classList.contains('delete-btn')) {
                const id = parseInt(event.target.parentElement.dataset.id);
                handler(id);
            }
        });
    }
}

module.exports = { View };
