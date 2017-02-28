const staticVersion = 'cp-static-v8';

self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(staticVersion).then(cache => {
			return cache.addAll([
				'/',
				'/static/js/bundle.js',
				//'/static/media/logo.5d5d9eef.svg'
			]);
		})
	);
});

self.addEventListener('activate', event => {
	event.waitUntil(
		caches.keys().then(cacheNames => {
			return Promise.all(
				cacheNames.filter(cacheName => {
					return cacheName.startsWith('cp-') && cacheName !== staticVersion
				}).map(cacheName => {
					console.log(`delete ${cacheName}!`);
					return caches.delete(cacheName);
				})
			)
		})
	);
})

self.addEventListener('push', event => {
	const title = 'Push';
	const body = 'This is a push';
	const icon = './logo.svg';
	const tag = 'simple-push-example-tag';

	event.waitUntil(
		self.registration.showNotification(title, {
			body, icon, tag
		})
	);
});

self.addEventListener('fetch', event => {
	event.respondWith(
		caches.match(event.request).then( response => {
			if (response) return response;
			return fetch(event.request);
		})
	);
});

self.addEventListener('message', event => {
	if (event.data.action === 'skipWaiting') {
		console.log('update success');
		self.skipWaiting();
	}
});