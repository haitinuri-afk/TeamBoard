// Minimal SW — enables Web Push / local notifications on iOS PWA
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
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
