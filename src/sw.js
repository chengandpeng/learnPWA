self.addEventListener('install', event => {
	const urlToCache = [
		'/',
		'static/js/bundle.js',
	];
	event.waitUntil(
		caches.open('cp-pwa').then(cache => {
			return cache.addAll(urlToCache);
		})
	);
});


self.addEventListener('fetch', event => {
	// event.respondWith(
	// 	new Response('hello world')
	// );
});