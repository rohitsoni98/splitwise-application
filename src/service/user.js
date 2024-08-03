import { USER_TABLE, openIndexedDB } from "./IndexedDB";
import _ from "lodash";

const getUserByName = async (name) => {
  return openIndexedDB()
    .then((db) => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(USER_TABLE, "readonly");
        const userStore = transaction.objectStore(USER_TABLE);

        const request = userStore.index("name").get(name);

        request.onsuccess = () => {
          resolve(request.result);
        };

        request.onerror = () => {
          reject(request.error);
        };
      });
    })
    .catch((error) => {
      return Error(error); // Handle database opening error
    });
};

export const signUp = async (data) => {
  return openIndexedDB()
    .then((db) => {
      return new Promise(async (resolve, reject) => {
        const userExistingData = await getUserByName(data.name);

        if (userExistingData) reject("user already existing");

        const transaction = db.transaction(USER_TABLE, "readwrite");
        const userStore = transaction.objectStore(USER_TABLE);

        const request = userStore.add({ ...data, friends: [] });

        request.onsuccess = () => {
          resolve(request.result);
        };

        request.onerror = (err) => {
          reject(request.error);
        };
      });
    })
    .catch((error) => {
      return Error(error); // Handle database opening error
    });
};

export const login = async (data) => {
  return openIndexedDB()
    .then((db) => {
      return new Promise(async (resolve, reject) => {
        const userExistingData = await getUserByName(data.name);

        if (!userExistingData) reject("user doesn't exist");

        resolve(userExistingData.id);
      });
    })
    .catch((error) => {
      return Error(error); // Handle database opening error
    });
};

export const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    openIndexedDB()
      .then((db) => {
        const transaction = db.transaction([USER_TABLE], "readonly");
        const userStore = transaction.objectStore(USER_TABLE);

        const getRequest = userStore.get(+id);

        getRequest.onsuccess = (event) => {
          const userInfo = event.target.result;
          const { friends, ...rest } = userInfo || {};
          if (userInfo) resolve(rest);
          else reject("User data not found");
        };

        transaction.onerror = (event) => {
          reject(event.target.error);
        };
      })
      .catch((error) => {
        return Error(error); // Handle database opening error
      });
  });
};

export const addFriend = (data) => {
  return new Promise((resolve, reject) => {
    openIndexedDB()
      .then(async (db) => {
        const transaction = db.transaction([USER_TABLE], "readwrite");
        const userStore = transaction.objectStore(USER_TABLE);
        const activeUserId = +localStorage.getItem("activeUserId"); // assuming being taken from auth token

        const getRequest = userStore.get(activeUserId);
        getRequest.onsuccess = () => {
          const currentUser = getRequest.result;
          const newFriendRequest = userStore.get(data.id);

          newFriendRequest.onsuccess = () => {
            const newFriend = newFriendRequest.result;

            if (currentUser.friends.find(({ id }) => id === newFriend.id))
              return reject("Already friend");

            currentUser.friends = [
              ...currentUser.friends,
              { id: data.id, balance: 0 },
            ];
            newFriend.friends = [
              ...newFriend.friends,
              { id: currentUser.id, balance: 0 },
            ];

            userStore.put(currentUser);
            userStore.put(newFriend);
          };
        };

        transaction.oncomplete = function (event) {
          // Handle successful completion (optional)
          resolve("new friend added.");
        };

        transaction.onerror = function (event) {
          // Handle transaction errors (optional)
          reject("failed to add");
        };
      })
      .catch((error) => {
        return Error(error); // Handle database opening error
      });
  });
};

export const getFriends = (id) => {
  return new Promise((resolve, reject) => {
    openIndexedDB()
      .then(async (db) => {
        const transaction = db.transaction([USER_TABLE], "readonly");
        const userStore = transaction.objectStore(USER_TABLE);
        const activeUserId = +localStorage.getItem("activeUserId"); // assuming being taken from auth token

        const getRequest = userStore.get(activeUserId);

        getRequest.onsuccess = () => {
          let { friends } = getRequest.result;

          const friendsMap = new Map(
            friends.map((d) => [d.id, _.pick(d, ["balance", "id"])])
          );

          const getAllUserReq = userStore.getAll();

          getAllUserReq.onsuccess = () => {
            const allUser = getAllUserReq.result;

            allUser.forEach(({ name, id }) => {
              if (friendsMap.has(id)) {
                friendsMap.set(id, { ...friendsMap.get(id), name });
              }
            });

            resolve(Array.from(friendsMap.values()));
          };
        };

        transaction.onerror = function (event) {
          // Handle transaction errors (optional)
          reject("failed to fetch");
        };
      })
      .catch((error) => {
        return Error(error); // Handle database opening error
      });
  });
};

export const getFriend = (friendId) => {
  return new Promise((resolve, reject) => {
    openIndexedDB()
      .then(async (db) => {
        const transaction = db.transaction([USER_TABLE], "readonly");
        const userStore = transaction.objectStore(USER_TABLE);
        const activeUserId = +localStorage.getItem("activeUserId"); // assuming being taken from auth token

        const getAllUserReq = userStore.getAll();

        getAllUserReq.onsuccess = () => {
          const allUsers = getAllUserReq.result;
          const allUsersMap = new Map(allUsers.map((user) => [user.id, user]));

          const friend = allUsersMap
            .get(activeUserId)
            .friends.find(({ id }) => id === friendId);

          resolve(
            _.omit({ ...allUsersMap.get(friend.id), ...friend }, ["friends"])
          );
        };

        transaction.onerror = function (event) {
          // Handle transaction errors (optional)
          reject("failed to fetch");
        };
      })
      .catch((error) => {
        return Error(error); // Handle database opening error
      });
  });
};

export const getUsers = () => {
  return new Promise((resolve, reject) => {
    openIndexedDB()
      .then(async (db) => {
        const transaction = db.transaction([USER_TABLE], "readonly");
        const userStore = transaction.objectStore(USER_TABLE);
        const activeUserId = localStorage.getItem("activeUserId"); // assuming being taken from auth token

        const getRequest = userStore.getAll();

        getRequest.onsuccess = () => {
          let users = getRequest.result;

          users = users
            .filter(({ id }) => id !== activeUserId)
            .map(({ friends, ...rest }) => rest);

          resolve(users);
        };

        transaction.onerror = function (event) {
          // Handle transaction errors (optional)
          reject("failed to fetch");
        };
      })
      .catch((error) => {
        return Error(error); // Handle database opening error
      });
  });
};
