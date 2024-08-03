import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Stack, Typography, IconButton } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import CallSplitIcon from "@mui/icons-material/CallSplit";
import { getUserById } from "../../service/user";

function Navbar() {
  const [activeUser, setActiveUser] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const activeUserId = localStorage.getItem("activeUserId");
        const user = await getUserById(+activeUserId);
        setActiveUser(user);
      } catch (error) {}
    })();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location = "/";
  };
  return (
    <Stack
      direction="row"
      bgcolor="primary.main"
      height={50}
      alignItems="center"
      justifyContent="space-between"
      pl={4}
      pr={4}
    >
      <Stack
        component={NavLink}
        to={"/dashboard"}
        direction="row"
        alignItems="center"
        className="text-decoration-none"
      >
        <CallSplitIcon />
        <Typography color="white" fontSize={22} fontWeight={600}>
          Splitwise
        </Typography>
      </Stack>
      {activeUser && (
        <Stack direction="row" gap={4} alignItems="center">
          <Typography>{activeUser?.name}</Typography>
          <IconButton onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Stack>
      )}
    </Stack>
  );
}

export default Navbar;
