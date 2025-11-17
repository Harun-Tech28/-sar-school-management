// Service Worker for SAR Educational Complex PWA
const CACHE_VERSION = 'v2.0.0';
const CACHE_NAME = `sar-edu-${CACHE_VERSION}`;
const STATIC_CACHE = `sar-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `sar-dynamic-${CACHE_VERSION}`;
const IMAGE_CACHE = `sar-images-${CACHE_VERSION}`;

// Critical resources to cache immediately
const PRECACHE_URLS = [
  '/',
  '/auth/login',
  '/offline.html',
];

// Static assets patterns
const STATIC_ASSETS = /\.(js|css|woff2?|ttf|eot)$/;
const IMAGE_ASSETS = /\.(png|jpg|jpeg|svg|gif|webp|ico)$/;
const API_ROUTES = /\/api\//;

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Precaching critical resources');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => self.skipWaiting())
      .catch((error) => console.error('[SW] Precache failed:', error))
  );
});

// Fetch event - smart caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome extensions
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  // API requests - Network first, cache fallback
  if (API_ROUTES.test(url.pathname)) {
    event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE));
    return;
  }

  // Images - Cache first, network fallback
  if (IMAGE_ASSETS.test(url.pathname)) {
    event.respondWith(cacheFirstStrategy(request, IMAGE_CACHE, 30 * 24 * 60 * 60 * 1000)); // 30 days
    return;
  }

  // Static assets - Cache first, network fallback
  if (STATIC_ASSETS.test(url.pathname)) {
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE, 7 * 24 * 60 * 60 * 1000)); // 7 days
    return;
  }

  // HTML pages - Network first, cache fallback
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE));
    return;
  }

  // Default - Network first
  event.respondWith(fetch(request).catch(() => caches.match('/offline.html')));
});

// Network first strategy (for dynamic content)
async function networkFirstStrategy(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/offline.html');
    }
    throw error;
  }
}

// Cache first strategy (for static assets)
async function cacheFirstStrategy(request, cacheName, maxAge) {
  const cached = await caches.match(request);
  
  if (cached) {
    // Check if cache is still fresh
    const cachedDate = new Date(cached.headers.get('date'));
    const now = new Date();
    if (now - cachedDate < maxAge) {
      return cached;
    }
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    if (cached) {
      return cached;
    }
    throw error;
  }
}

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  const cacheWhitelist = [STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE];
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheWhitelist.includes(cacheName)) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim();
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  // Sync any pending data when back online
  console.log('Syncing data...');
}

// Push notifications
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'SAR Educational Complex';
  const options = {
    body: data.body || 'New notification',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    data: data.url || '/',
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data)
  );
});
