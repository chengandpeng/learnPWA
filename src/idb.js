import idb from 'idb';

const dbPromise = idb.open('test-db', 2, upgradeDB => {
	console.log(upgradeDB.oldVersion);
	switch (upgradeDB.oldVersion) {
		case 0:
			const keyValueStore = upgradeDB.createObjectStore('keyValue');
			keyValueStore.put('world', 'hello');
		case 1:
			upgradeDB.createObjectStore('people', { keyPath: 'name' });
		default:
			return;
	}

	
});

dbPromise.then(db => {
	const tx = db.transaction('keyValue');
	const keyValueStore = tx.objectStore('keyValue');
	return keyValueStore.get('hello');
}).then(val => {
	console.log(val);
});

dbPromise.then(db => {
	const tx = db.transaction('keyValue', 'readwrite');
	const keyValueStore = tx.objectStore('keyValue');
	keyValueStore.put('this', 'time');
	return tx.complete;
})