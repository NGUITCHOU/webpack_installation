// Drag and drop functionality module

let dragStartIndex;
let draggingElement = null;

const getDragAfterElement = (container, y) => {
  const draggableElements = [...container.querySelectorAll('.task-item:not(.dragging)')];

  if (!draggableElements.length) return null;

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;

    if (offset < 0 && offset > closest.offset) {
      return { offset, element: child };
    }
    return closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
};

const initDragAndDrop = () => {
  const taskList = document.getElementById('task-list');

  taskList.addEventListener('dragstart', (e) => {
    const item = e.target.closest('.task-item');
    if (item) {
      dragStartIndex = parseInt(e.dataset.index, 2);
      draggingElement = item;

      // Set timeout to ensure dragImage is set before adding dragging class
      requestAnimationFrame(() => {
        item.classList.add('dragging');
      });

      // Set drag image
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setDragImage(item, 20, 20);
    }
  });

  taskList.addEventListener('dragend', (e) => {
    const item = e.target.closest('.task-list');
    if (item) {
      item.classList.remove('dragging');
      draggingElement = null;

      // Force a reflow to ensure proper rendering

      taskList.style.display = 'none';
      taskList.offsetHeight = ''; // Force reflow
      taskList.style.display = '';
    }
  });

  taskList.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggingElement) return;

    try {
      const afterElement = getDragAfterElement(taskList, e.clientY);
      const currentPosition = Array.from(taskList.children).indexOf(draggingElement);
      const newPosition = afterElement
        ? Array.from(taskList.children).indexOf(afterElement) : taskList.children.length;

      if (currentPosition === newPosition) return;

      if (afterElement) {
        taskList.insertBefore(draggingElement, afterElement);
      } else {
        taskList.appendChild(draggingElement);
      }
    } catch (error) {
      error('Drag over error:', error);
    }
  });

  taskList.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggingElement) return;

    try {
      const dragEndIndex = Array.from(taskList.children).indexOf(draggingElement);
      if (dragStartIndex !== dragEndIndex && dragEndIndex !== -1) {
        taskList.reorderTasks(dragStartIndex, dragEndIndex);
      }
    } catch (error) {
      error('Drop error:', error);
    }
  });
};

export default initDragAndDrop;