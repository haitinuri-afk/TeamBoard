// SW — always fetches fresh HTML, enables notifications
const SW_V = '20260610-003';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', e => {
  e.waitUntil(
    self.clients.claim().then(() =>
      self.clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then(clients => clients.forEach(c => c.navigate(c.url)))
    )
  );
});

// Network-first for HTML navigation — never serve stale page from cache
self.addEventListener('fetch', e => {
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request.url, { cache: 'no-store' }).catch(() => fetch(e.request))
    );
  }
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = new URL('/TeamBoard/', self.location.origin).href;
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      const win = list.find(w => w.url.startsWith(url));
      return win ? win.focus() : clients.openWindow(url);
    })
  );
});
