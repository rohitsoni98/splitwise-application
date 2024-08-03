import React, { useEffect, useState } from "react";
import { Modal, Fade, Box, Backdrop, Button } from "@mui/material";
import AutoComplete from "../../component/autoComplete/AutoComplete";
import { addFriend, getUsers, signUp } from "../../../service/user";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "white",
  boxShadow: 24,
  p: 4,
};

function AddFriendModal({ open, onClose, onSuccess, friendsId }) {
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (open) fetchUserList();

    return () => {
      setSelectedUser(null);
    };
  }, [open]);

  const fetchUserList = async () => {
    try {
      const users = (await getUsers()) || [];
      const activeUserId = localStorage.getItem("activeUserId");
      const ignoreUserSet = new Set([...friendsId, +activeUserId]);
      const filteredUser = users.filter(({ id }) => !ignoreUserSet.has(id));
      setUserList(filteredUser);
    } catch (error) {}
  };

  const handleEnterPress = async (name) => {
    const id = await signUp({ name });
    setSelectedUser({ name, id });
  };

  const handleAddClick = async () => {
    await addFriend({ id: selectedUser.id });
    onSuccess();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <AutoComplete
            label="Enter Name"
            options={userList}
            value={selectedUser}
            placeholder="select from the option or create a new one"
            onSelect={(option) => {
              setSelectedUser(option);
            }}
            optionLabel="name"
            onEnterPress={handleEnterPress}
            matchNotFoundMessage="Hit enter add as friend"
          />

          <Button
            variant="contained"
            size="small"
            sx={{ mt: 4, width: "100%" }}
            disabled={!selectedUser}
            onClick={handleAddClick}
          >
            Add
          </Button>
        </Box>
      </Fade>
    </Modal>
  );
}

export default AddFriendModal;
