document.getElementById('contact').addEventListener('submit', async e => {
  e.preventDefault();
  const status = document.getElementById('status');
  status.textContent = 'Sending…';
  const res = await fetch('/api/send', {method:'POST', body:new FormData(e.target)});
  const j = await res.json();
  status.textContent = j.ok ? 'Sent! I’ll get back to you soon.' : 'Error: '+j.error;
  if(j.ok) e.target.reset();
});
