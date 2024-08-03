import React, { useEffect, useState } from "react";
import moment from "moment";
import { useParams } from "react-router-dom";
import { Box, Divider, Typography } from "@mui/material";
import Header from "../pageComponent/header/Header";
import ExpenseListItem from "../pageComponent/expenseListItem/ExpenseListItem";
import { getFriend } from "../../../service/user";
import AddExpenseModal from "../pageComponent/addExpenseModal/AddExpenseModal";
import { getActivities } from "../../../service/activity";

function FriendExpenses() {
  const { id: friendId } = useParams();
  const [friendDetails, setFriendDetails] = useState({});
  const [expenseList, setExpenseList] = useState([]);
  const [openExpenseModal, setOpenExpenseModal] = useState(false);

  useEffect(() => {
    getFriend(+friendId).then((d) => setFriendDetails(d));
    getActivities({ friendId: +friendId }).then((list) => setExpenseList(list));
  }, [friendId]);

  const toggleExpenseModal = () => {
    setOpenExpenseModal((p) => !p);
  };

  const onSuccess = (newActivity) => {
    toggleExpenseModal();
    setExpenseList((prev) => [newActivity, ...prev]);
  };

  let currentDate = new Date().setFullYear(2000);

  return (
    <Box>
      <Header title={friendDetails.name} onAddExpense={toggleExpenseModal} />
      <Divider />

      {expenseList.map((data) => {
        const isSame = moment(data.createdOn)
          .startOf("day")
          .isSame(moment(currentDate).startOf("day"));
        currentDate = data.createdOn;
        return (
          <>
            {!isSame && (
              <Typography
                fontSize="12px"
                fontWeight={600}
                bgcolor="container.main"
                p={0.2}
              >
                {moment(currentDate).format("MMMM YYYY").toUpperCase()}
              </Typography>
            )}
            <ExpenseListItem data={data} friendId={+friendId} />
          </>
        );
      })}

      <AddExpenseModal
        open={openExpenseModal}
        onClose={toggleExpenseModal}
        onSuccess={onSuccess}
        currentFriend={friendDetails}
      />
    </Box>
  );
}

export default FriendExpenses;
