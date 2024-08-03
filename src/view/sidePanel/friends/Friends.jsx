import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import {
  Stack,
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import { getFriends } from "../../../service/user";
import AddFriendModal from "./AddFriendModal";

function Friends() {
  const friendId = useParams()?.id;

  const [friendList, setFriendList] = useState([]);
  const [openAddFriendModal, setOpenAddFriendModal] = useState(false);

  useEffect(() => {
    fetchFriendList();
  }, []);

  const fetchFriendList = async () => {
    try {
      const data = await getFriends();
      setFriendList(data);
    } catch (error) {
      //
    }
  };

  const toggleAddFriendModal = () => {
    setOpenAddFriendModal(!openAddFriendModal);
  };

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        bgcolor={"container.light"}
      >
        <Typography fontSize={12}>FRIENDS</Typography>
        <Button
          sx={{ padding: 0, fontSize: 12 }}
          startIcon={<AddIcon />}
          onClick={toggleAddFriendModal}
        >
          Add
        </Button>
      </Stack>
      <List>
        {friendList.map(({ name, id }) => {
          const active = +friendId === id;
          const color = active ? "primary.main" : "text.faded";
          return (
            <ListItem key={name} disableGutters disablePadding>
              <ListItemButton
                component={Link}
                to={`/friends/${id}`}
                disablePadding
                disableRipple
                disableGutters
                sx={{ pt: 0, pb: 0 }}
              >
                <ListItemIcon sx={{ minWidth: "fit-content", mr: 1 }}>
                  <PersonIcon sx={{ color }} />
                </ListItemIcon>
                <ListItemText primary={name} sx={{ color }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <AddFriendModal
        open={openAddFriendModal}
        onClose={toggleAddFriendModal}
        friendsId={useMemo(() => friendList.map((_) => _.id), [friendList])}
        onSuccess={() => {
          fetchFriendList();
          toggleAddFriendModal();
        }}
      />
    </Box>
  );
}

export default Friends;
