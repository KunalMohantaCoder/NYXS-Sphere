export function timeAgo(dateStr) {
  const now = new Date(), d = new Date(dateStr), diff = Math.floor((now - d) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function showToast(msg, type = 'success') {
  const c = document.getElementById('toast-container');
  const t = document.createElement('div');
  const colors = { success: 'bg-emerald-950 border-emerald-900 text-emerald-300', error: 'bg-red-950 border-red-900 text-red-300', info: 'bg-indigo-950 border-indigo-900 text-indigo-300' };
  const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };
  t.className = `fixed flex items-center gap-2.5 px-5 py-3.5 rounded-xl text-sm font-medium shadow-2xl border z-[200] ${colors[type]}`;
  t.style.cssText = 'top:20px;right:20px;animation:fadeInUp .35s ease both;';
  t.innerHTML = `<i class="fa-solid ${icons[type]}"></i> ${msg}`;
  c.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateY(-10px)'; t.style.transition = 'all .3s'; setTimeout(() => t.remove(), 300); }, 3000);
}

export function getInitials(name) {
  return name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
}