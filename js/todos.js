function addTodo() {
  const input = document.getElementById('todoInput');
  const text  = input.value.trim();
  if (!text) return;
  todos.push({ id: nextId++, text, done: false });
  input.value = '';
  renderTodos();
}

document.getElementById('todoInput').addEventListener('keydown', function (e) {
  if (e.key === 'Enter') addTodo();
});

function toggleTodo(id) {
  const t = todos.find(t => t.id === id);
  if (t) t.done = !t.done;
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  renderTodos();
}

function setFilter(f) {
  filter = f;
  document.getElementById('filterAll').classList.toggle('active',    f === 'all');
  document.getElementById('filterActive').classList.toggle('active', f === 'active');
  document.getElementById('filterDone').classList.toggle('active',   f === 'done');
  renderTodos();
}

function renderTodos() {
  const list    = document.getElementById('todoList');
  const visible = todos.filter(t => {
    if (filter === 'active') return !t.done;
    if (filter === 'done')   return t.done;
    return true;
  });

  if (visible.length === 0) {
    list.innerHTML = '<div class="empty-state">Nothing here.</div>';
    return;
  }

  list.innerHTML = visible.map(t => `
    <div class="todo-item">
      <input type="checkbox" ${t.done ? 'checked' : ''} onchange="toggleTodo(${t.id})">
      <span class="todo-text ${t.done ? 'done' : ''}">${esc(t.text)}</span>
      <button class="btn-delete" onclick="deleteTodo(${t.id})" title="Delete">✕</button>
    </div>
  `).join('');
}
