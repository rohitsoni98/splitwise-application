import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Typography, Grid, Divider } from "@mui/material";
import styled from "@emotion/styled";
import Header from "../pageComponent/header/Header";
import { getFriends } from "../../../service/user";
import FriendListing from "./FriendListing";

const GridItem = styled(Grid)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

function Dashboard() {
  const [friendList, setFriendList] = useState([]);

  useEffect(() => {
    getFriends().then((list) => setFriendList(list));
  }, []);

  const iOweAmount = useMemo(
    () =>
      friendList.reduce((prev, { balance }) => {
        const result = prev + (balance < 0 ? balance : 0);
        return result;
      }, 0),
    [friendList]
  );

  const iAmOwedAmount = useMemo(
    () =>
      friendList.reduce((prev, { balance }) => {
        const result = prev + (balance > 0 ? balance : 0);
        return result;
      }, 0),
    [friendList]
  );

  return (
    <Box>
      <Header title={"Dashboard"} hideButtons />
      <Divider />
      <Grid
        p={2}
        display="grid"
        gridTemplateColumns="1fr 1fr 1fr"
        bgcolor="container.main"
      >
        <GridItem item borderRight={1}>
          <Typography fontSize="12px">total balance</Typography>
          <Typography fontSize="12px">
            {(iOweAmount + iAmOwedAmount).toFixed(2)}
          </Typography>
        </GridItem>
        <GridItem item borderRight={1}>
          <Typography fontSize="12px">you owe</Typography>
          <Typography fontSize="12px">{iOweAmount.toFixed(2)}</Typography>
        </GridItem>
        <GridItem item>
          <Typography fontSize="12px">you are owed</Typography>
          <Typography fontSize="12px">{iAmOwedAmount.toFixed(2)}</Typography>
        </GridItem>
      </Grid>
      <Divider />

      <Grid display="grid" gridTemplateColumns="1fr 1fr">
        <Grid item borderRight={1} p={2}>
          <Typography>YOU OWE</Typography>
          <FriendListing
            friendList={friendList}
            filterFn={useCallback(({ balance }) => balance < 0)}
          />
        </Grid>

        <Grid item p={2}>
          <Typography textAlign="end"> YOU ARE OWED</Typography>
          <FriendListing
            friendList={friendList}
            filterFn={useCallback(({ balance }) => balance > 0)}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
