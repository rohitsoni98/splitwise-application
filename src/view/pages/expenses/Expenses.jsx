import React, { useEffect, useState } from "react";
import moment from "moment";
import { Box, Divider, Typography } from "@mui/material";
import Header from "../pageComponent/header/Header";
import ExpenseListItem from "../pageComponent/expenseListItem/ExpenseListItem";
import { getActivities } from "../../../service/activity";
import AddExpenseModal from "../pageComponent/addExpenseModal/AddExpenseModal";

function Expenses() {
  const [expenseList, setExpenseList] = useState([]);
  const [openExpenseModal, setOpenExpenseModal] = useState(false);

  useEffect(() => {
    getActivities().then((list) => setExpenseList(list));
  }, []);

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
      <Header title="All Expenses" onAddExpense={toggleExpenseModal} />
      <Divider />
      {expenseList.map((data) => {
        const isSame = moment(data.createdOn).isSame(
          moment(currentDate),
          "month"
        );
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
            <ExpenseListItem data={data} />
          </>
        );
      })}
      <AddExpenseModal
        open={openExpenseModal}
        onClose={toggleExpenseModal}
        onSuccess={onSuccess}
      />
    </Box>
  );
}

export default Expenses;
