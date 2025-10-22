const { TodoService } = require('./js/model');
const { View } = require('./js/view');
const { Controller } = require('./js/controller');

// This file runs when the window content is loaded.
window.addEventListener('DOMContentLoaded', () => {
  // Initialize the MVC components
  const todoService = new TodoService();
  const view = new View();
  const controller = new Controller(todoService, view);

  // The controller sets up the initial state and event listeners.
  controller.initialize();
});
