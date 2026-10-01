// Each task has an id, a title, and a done flag. The array is our app's data.
const STORAGE_KEY = 'daylist-tasks';
let tasks = [];
let currentFilter = 'all';
let editingId = null;

const addForm = document.querySelector('#add-form');
const taskInput = document.querySelector('#task-input');
const taskList = document.querySelector('#task-list');
const status = document.querySelector('#status');

// Storage can be unavailable in private browsing or when the browser is full.
try {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  if (Array.isArray(saved)) {
    tasks = saved.filter(task => task && typeof task.id === 'string' &&
      typeof task.title === 'string' && typeof task.done === 'boolean');
  }
} catch {
  status.textContent = 'Saved tasks could not be loaded. You can still use your list.';
}

document.querySelector('#today').textContent = new Date().toLocaleDateString('en', {
  weekday: 'long', month: 'long', day: 'numeric'
}).toUpperCase();

function saveTasks(message) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    status.textContent = message;
  } catch {
    status.textContent = 'Your changes work for now, but could not be saved in this browser.';
  }
}

// Build elements with textContent so task text is always treated as plain text.
function makeButton(text, className) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = className;
  button.textContent = text;
  return button;
}

function renderTasks() {
  taskList.replaceChildren();
  const visibleTasks = tasks.filter(task => currentFilter === 'all' ||
    (currentFilter === 'done' ? task.done : !task.done));

  visibleTasks.forEach(task => {
    const row = document.createElement('li');
    row.className = `task-row${task.done ? ' completed' : ''}`;
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.id = `task-${task.id}`;
    checkbox.checked = task.done;
    checkbox.setAttribute('aria-label', `Mark ${task.title} as ${task.done ? 'to do' : 'done'}`);
    checkbox.addEventListener('change', () => {
      task.done = checkbox.checked;
      saveTasks(task.done ? 'Task completed. Nice work!' : 'Task marked as to do.');
      renderTasks();
      const nextCheckbox = document.getElementById(checkbox.id);
      (nextCheckbox || document.querySelector('.filter.active')).focus();
    });
    row.append(checkbox);

    if (editingId === task.id) {
      const form = document.createElement('form');
      form.className = 'edit-form';
      const input = document.createElement('input');
      input.className = 'edit-input';
      input.value = task.title;
      input.maxLength = 200;
      input.required = true;
      input.setAttribute('aria-label', 'Edit task title');
      const save = makeButton('Save', 'save-button');
      save.type = 'submit';
      const cancel = makeButton('Cancel', 'cancel-button');
      function closeEditor() {
        editingId = null;
        renderTasks();
        document.getElementById(`edit-${task.id}`).focus();
      }
      cancel.addEventListener('click', closeEditor);
      input.addEventListener('keydown', event => {
        if (event.key === 'Escape') { event.preventDefault(); closeEditor(); }
      });
      input.addEventListener('input', () => input.setCustomValidity(''));
      form.addEventListener('submit', event => {
        event.preventDefault();
        if (!input.value.trim()) {
          input.setCustomValidity('Please enter a task.');
          input.reportValidity();
          return;
        }
        task.title = input.value.trim();
        saveTasks('Task updated.');
        closeEditor();
      });
      form.append(input, save, cancel);
      row.append(form);
    } else {
      const label = document.createElement('label');
      label.className = 'task-label';
      label.htmlFor = checkbox.id;
      label.textContent = task.title;
      const edit = makeButton('Edit ↗', 'edit-button');
      edit.id = `edit-${task.id}`;
      edit.setAttribute('aria-label', `Edit ${task.title}`);
      edit.addEventListener('click', () => {
        editingId = task.id;
        renderTasks();
        const input = document.querySelector('.edit-input');
        input.focus();
        input.select();
      });
      row.append(label, edit);
    }
    taskList.append(row);
  });

  const completed = tasks.filter(task => task.done).length;
  const percentage = tasks.length ? Math.round(completed / tasks.length * 100) : 0;
  document.querySelector('#task-count').textContent = tasks.length;
  document.querySelector('#remaining').textContent = `${tasks.length - completed} left to do`;
  document.querySelector('#progress-text').textContent = tasks.length
    ? `${completed} of ${tasks.length} completed. ${completed === tasks.length ? 'Look at you go!' : 'Every small step counts.'}`
    : 'Your next small step starts here.';
  document.querySelector('#progress-number').textContent = `${percentage}%`;
  document.querySelector('#progress-fill').style.width = `${percentage}%`;
  const empty = document.querySelector('#empty-state');
  empty.hidden = visibleTasks.length > 0;
  empty.querySelector('h3').textContent = currentFilter === 'all' ? 'A fresh start.' : currentFilter === 'done' ? 'Good things take small steps.' : 'All clear.';
  empty.querySelector('p').textContent = currentFilter === 'all' ? 'Add your first task and take it from there.' : currentFilter === 'done' ? 'Your completed tasks will appear here.' : 'No tasks left to do. Enjoy a little breathing room.';
}

taskInput.addEventListener('input', () => taskInput.setCustomValidity(''));
addForm.addEventListener('submit', event => {
  event.preventDefault();
  const title = taskInput.value.trim();
  if (!title) {
    taskInput.setCustomValidity('Please enter a task.');
    taskInput.reportValidity();
    return;
  }
  tasks.push({ id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, title, done: false });
  taskInput.value = '';
  editingId = null;
  setFilter('all');
  saveTasks('Task added. One small step forward.');
  taskInput.focus();
});

function setFilter(filter) {
  currentFilter = filter;
  editingId = null;
  document.querySelectorAll('.filter').forEach(button => {
    const selected = button.dataset.filter === filter;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  renderTasks();
}

document.querySelectorAll('.filter').forEach(button => {
  button.addEventListener('click', () => setFilter(button.dataset.filter));
});

renderTasks();
