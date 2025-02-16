import TaskManager from '../modules/taskManager.js';

describe('TaskManager', () => {
  let taskManager;
  let taskList;

  beforeEach(() => {
    document.body.innerHTML = `
      <ul id="task-list"></ul>
      <input id="task-input" />
    `;
    taskList = document.getElementById('task-list');
    taskManager = new TaskManager('task-list', 'task-input');
  });

  test('should delete a task when delete button is clicked', () => {
    // Arrange: Add a task to the task manager
    taskManager.addTask('Test Task 1');
    const deleteButton = taskList.querySelector('.delete-btn');

    // Act: Simulate clicking the delete button
    deleteButton.click();

    // Assert: Check that the task has been removed from the list
    expect(taskList.children.length).toBe(0); // The task list should be empty
  });
});