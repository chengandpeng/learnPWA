self.addEventListener('install', event => {
	event.waitUntil(
		caches.open('cp-static-v1').then(cache => {
			return cache.addAll([
				'/',
				'/static/js/bundle.js',
				//'/static/media/logo.5d5d9eef.svg'
			]);
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
