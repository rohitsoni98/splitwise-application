const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;

const DB_NAME = "splitwise";
const DB_VERSION = 1;
export const USER_TABLE = "user_table";
export const ACTIVITY_TABLE = "activity_table";

export const openIndexedDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains(USER_TABLE)) {
        const userStore = db.createObjectStore(USER_TABLE, {
          keyPath: "id",
          autoIncrement: true,
        });

        userStore.createIndex("name", "name", { unique: true });
      }

      if (!db.objectStoreNames.contains(ACTIVITY_TABLE)) {
        db.createObjectStore(ACTIVITY_TABLE, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};
