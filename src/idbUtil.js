import idb from 'idb';

const DBVERSION = 1;
const TABLE = 'chat-messages';

const dbPromise = idb.open('service-worker-test', DBVERSION, upgradeDB => {
  switch (upgradeDB.oldVersion) {
    case 0:
      const keyValueStore = upgradeDB.createObjectStore('test');
      keyValueStore.put('world', 'hello');  
    // case 1:
    //   upgradeDB.createObjectStore(TABLE, { keyPath: 'date' });
    // case 2:
    //   const store = upgradeDB.transaction.objectStore(TABLE);
    //   store.createIndex('ID', 'id');
  }
});

export const idbUtil = {
  get(key) {
    return dbPromise.then(db => {
      return db.transaction(TABLE)
        .objectStore(TABLE).get(key);
    });
  },
  getAll() {
    return dbPromise.then(db => {
      return db.transaction(TABLE)
        .objectStore(TABLE).getAll();
    });
  },
  set(val, key = null) {
    return dbPromise.then(db => {
      const tx = db.transaction(TABLE, 'readwrite');
      tx.objectStore(TABLE).put(val);
      return tx.complete;
    });
  },
  delete(key) {
    return dbPromise.then(db => {
      const tx = db.transaction(TABLE, 'readwrite');
      tx.objectStore(TABLE).delete(key);
      return tx.complete;
    });
  },
  clear() {
    return dbPromise.then(db => {
      const tx = db.transaction(TABLE, 'readwrite');
      tx.objectStore(TABLE).clear();
      return tx.complete;
    });
  },
  keys() {
    return dbPromise.then(db => {
      const tx = db.transaction(TABLE);
      const keys = [];
      const store = tx.objectStore(TABLE);

      (store.iterateKeyCursor || store.iterateCursor).call(store, cursor => {
        if (!cursor) return;
        keys.push(cursor.key);
        cursor.continue();
      });

      return tx.complete.then(() => keys);
    });
  }
};