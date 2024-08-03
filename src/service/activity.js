import { ACTIVITY_TABLE, USER_TABLE, openIndexedDB } from "./IndexedDB";
import _ from "lodash";

export const addExpense = async (data) => {
  return openIndexedDB()
    .then((db) => {
      return new Promise(async (resolve, reject) => {
        const { userSplit, description, splitted = "equally" } = data;

        const paidBy = userSplit.find(({ paid }) => paid > 0);
        const owedBy = userSplit.filter(({ id }) => id !== paidBy.id);
        const owedByMap = new Map(owedBy.map((_) => [_.id, _]));

        const user_transaction = db.transaction([USER_TABLE], "readwrite");
        const userStore = user_transaction.objectStore(USER_TABLE);

        const getAllUserReq = userStore.getAll();

        getAllUserReq.onsuccess = () => {
          const allUsers = getAllUserReq.result;
          const allUsersMap = new Map(allUsers.map((user) => [user.id, user]));

          const paidByUser = allUsersMap.get(paidBy.id);
          const paidByUserFriendsMap = new Map(
            paidByUser.friends.map((_) => [_.id, _])
          );

          const owedByUser = owedBy.map(({ id }) => allUsersMap.get(id));

          const commonConnections = owedByUser
            .filter((_) => paidByUserFriendsMap.has(_.id))
            .map((user) => {
              const owedAmount = owedByMap.get(user.id).owed;

              // iifi for local scope
              (() => {
                const storedData = paidByUserFriendsMap.get(user.id);
                storedData.balance += owedAmount;
                paidByUserFriendsMap.set(user.id, storedData);
              })();

              const index = user.friends.findIndex(
                ({ id }) => id === paidBy.id
              );

              user.friends[index].balance -= owedAmount;
              return user;
            });

          const missingOwedConnections = owedByUser
            .filter((_) => !paidByUserFriendsMap.has(_.id))
            .map((user) => {
              // making missing each other friend
              const owedAmount = owedByMap.get(user.id).owed;
              paidByUserFriendsMap.set(user.id, {
                id: user.id,
                balance: owedAmount,
              });
              user.friends.push({
                id: paidByUser.id,
                balance: -owedAmount,
              });
              return user;
            });

          const toUpdateUsers = [
            ...commonConnections,
            ...missingOwedConnections,
            {
              ...paidByUser,
              friends: Array.from(paidByUserFriendsMap.values()),
            },
          ];

          toUpdateUsers.forEach((each) => userStore.put(each));

          const users = [paidBy, ...owedBy].map((each) => ({
            ...each,
            ..._.omit(allUsersMap.get(each.id), ["friends"]),
          }));

          const newActivity = {
            description,
            splitted,
            createdBy: _.pick(paidByUser, ["id", "name"]),
            createdOn: new Date(),
            users,
          };

          const activity_transaction = db.transaction(
            ACTIVITY_TABLE,
            "readwrite"
          );

          const activityStore =
            activity_transaction.objectStore(ACTIVITY_TABLE);
          const request = activityStore.add(newActivity);

          request.onsuccess = function (event) {
            resolve({ id: request.result, ...newActivity });
          };

          request.onerror = (err) => {
            reject(request.error);
          };
        };
      });
    })
    .catch((error) => {
      return Error(error); // Handle database opening error
    });
};

export const getActivities = async (data) => {
  return openIndexedDB()
    .then((db) => {
      return new Promise((resolve, reject) => {
        const activity_transaction = db.transaction(
          ACTIVITY_TABLE,
          "readwrite"
        );

        const activityStore = activity_transaction.objectStore(ACTIVITY_TABLE);
        const activeUserId = +localStorage.getItem("activeUserId"); // assuming being taken from auth token

        const activityListRequest = activityStore.getAll();

        activityListRequest.onsuccess = () => {
          const list = activityListRequest.result;

          const requiredList = list
            .filter(({ createdBy, users }) => {
              const userIdsSet = new Set(users.map(({ id }) => id));

              if (!data?.friendId) return userIdsSet.has(activeUserId);

              return (
                (createdBy.id === activeUserId ||
                  createdBy.id === data.friendId) &&
                userIdsSet.has(data.friendId)
              );
            })
            .sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn));

          resolve(requiredList);
        };

        activityListRequest.onerror = () => {
          reject("error");
        };
      });
    })
    .catch((error) => {
      return Error(error); // Handle database opening error
    });
};
