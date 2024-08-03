import React from "react";
import { Box, Stack, Typography, Divider } from "@mui/material";
import moment from "moment";

function ExpenseListItem({ data, friendId }) {
  const activeUserId = +localStorage.getItem("activeUserId");

  const { createdBy, users } = data;
  const lentAmount =
    createdBy.id === activeUserId
      ? friendId
        ? users.find(({ id }) => id === friendId)?.owed
        : users.slice(1).reduce((p, a) => p + a.owed, 0)
      : users.find(({ id }) => id === activeUserId)?.owed;

  const sliceName = (name) => name.split(" ")[0].slice(0, 10);

  return (
    <>
      <Stack p={1} direction="row" gap={1}>
        <Box>
          <Typography fontSize="10px" color="text.faded" lineHeight={1}>
            {moment(data.createdOn).format("MMM").toUpperCase()}
          </Typography>
          <Typography
            fontSize="18px"
            fontWeight="500"
            color="text.faded"
            lineHeight={1}
          >
            {moment(data.createdOn).format("DD")}
          </Typography>
        </Box>

        <Stack direction="row" justifyContent="space-between" width="100%">
          <Typography fontSize="18px" fontWeight="600">
            {data.description}
          </Typography>

          <Stack direction="row" gap={2} sx={{ alignSelf: "end" }}>
            <Box textAlign="end" width="120px">
              <Typography fontSize="10px" color="text.faded" lineHeight={1}>
                {createdBy.id === activeUserId
                  ? "you paid"
                  : `${sliceName(createdBy.name)} paid`}
              </Typography>
              <Typography fontSize="18px" fontWeight="600" lineHeight={1}>
                {users[0].paid}
              </Typography>
            </Box>

            <Box textAlign="start" width="120px">
              <Typography fontSize="10px" color="text.faded" lineHeight={1}>
                {createdBy.id === activeUserId
                  ? `you lent ${
                      users.length <= 2 ? sliceName(users[1].name) : "" // in case multiple : not showing any name
                    }`
                  : `${sliceName(createdBy.name)} lent you`}
              </Typography>
              <Typography fontSize="18px" fontWeight="600" lineHeight={1}>
                {lentAmount}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Stack>
      <Divider />
    </>
  );
}

export default React.memo(ExpenseListItem);
