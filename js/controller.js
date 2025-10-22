class Controller {
    constructor(service, view) {
        this.service = service;
        this.view = view;
    }

    initialize() {
        // --- OBSERVER PATTERN ---
        // The controller subscribes the view to the service.
        this.service.addObserver(this.view);

        // Bind view events to controller handlers
        this.view.bindAddTodo(this.handleAddTodo.bind(this));
        this.view.bindToggleTodo(this.handleToggleTodo.bind(this));
        this.view.bindRemoveTodo(this.handleRemoveTodo.bind(this));

        // Initial render
        this.view.update(this.service.getTodos());
    }

    handleAddTodo(text) {
        this.service.addTodo(text);
    }

    handleToggleTodo(id) {
        this.service.toggleTodoComplete(id);
    }

    handleRemoveTodo(id) {
        this.service.removeTodo(id);
    }
}

module.exports = { Controller };
