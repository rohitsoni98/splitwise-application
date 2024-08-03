import React from "react";
import { Stack, Typography, Button } from "@mui/material";

function Header({ title, hideButtons, onAddExpense }) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      bgcolor="container.main"
      p={1.5}
    >
      <Typography fontSize="24px" fontWeight="800">
        {title}
      </Typography>
      {!hideButtons && (
        <Button
          variant="contained"
          sx={{ bgcolor: "secondary.main" }}
          onClick={onAddExpense}
        >
          Add an expense
        </Button>
      )}
    </Stack>
  );
}

export default Header;
