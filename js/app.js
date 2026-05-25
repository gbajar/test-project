let currentUser = '';
let todos = [];
let nextId = 1;
let filter = 'all';

function showView(id) {
  document.getElementById('loginView').classList.remove('active');
  document.getElementById('appShell').classList.remove('active');
  document.getElementById(id).classList.add('active');
}

function showPage(page) {
  document.getElementById('dashboardPage').style.display = page === 'dashboard' ? 'block' : 'none';
  document.getElementById('todosPage').style.display     = page === 'todos'     ? 'block' : 'none';
  document.getElementById('navDashboard').classList.toggle('active', page === 'dashboard');
  document.getElementById('navTodos').classList.toggle('active', page === 'todos');
  if (page === 'dashboard') updateDashboard();
}

function updateDashboard() {
  const total     = todos.length;
  const completed = todos.filter(t => t.done).length;
  document.getElementById('statTotal').textContent     = total;
  document.getElementById('statCompleted').textContent = completed;
  document.getElementById('statPending').textContent   = total - completed;

  const tbody  = document.getElementById('recentTable');
  const recent = [...todos].reverse().slice(0, 5);

  if (recent.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3" class="empty-state">No todos yet — add some on the Todos page.</td></tr>';
  } else {
    tbody.innerHTML = recent.map(t => `
      <tr>
        <td>${t.id}</td>
        <td>${esc(t.text)}</td>
        <td><span class="badge ${t.done ? 'completed' : 'pending'}">${t.done ? 'Completed' : 'Pending'}</span></td>
      </tr>
    `).join('');
  }
}

function esc(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
