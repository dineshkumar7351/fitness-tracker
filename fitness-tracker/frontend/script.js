const form = document.getElementById('fitnessForm');
const logList = document.getElementById('logList');

const API_URL = 'http://localhost:3000/api/fitness';

async function loadLogs() {
  const res = await fetch(API_URL);
  const data = await res.json();
  logList.innerHTML = '';
  data.forEach(log => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span><strong>${log.activity}</strong> - ${log.duration} min</span>
      <button class="delete-btn" onclick="deleteLog('${log._id}')">×</button>
    `;
    logList.appendChild(li);
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const activity = document.getElementById('activity').value.trim();
  const duration = parseInt(document.getElementById('duration').value.trim());

  if (!activity || isNaN(duration)) return alert("Please enter valid data");

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ activity, duration })
  });

  if (res.ok) {
    form.reset();
    loadLogs();
  } else {
    alert("Failed to add entry");
  }
});

async function deleteLog(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (res.ok) loadLogs();
  else alert("Failed to delete");
}

loadLogs();
