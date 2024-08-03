import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Fade,
  Box,
  Backdrop,
  Button,
  Stack,
  TextField,
  Typography,
  Chip,
  Popover,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import AutoComplete from "../../../component/autoComplete/AutoComplete";
import { addFriend, getFriends, signUp } from "../../../../service/user";
import { isValidNumber } from "../../../../utils/utils";
import { addExpense } from "../../../../service/activity";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  height: 500,
  bgcolor: "white",
  boxShadow: 24,
  p: 4,
};

function AddExpenseModal({ open, onClose, onSuccess, currentFriend }) {
  const activeUserId = +localStorage.getItem("activeUserId");
  const [userList, setUserList] = useState([]);
  const [formState, setFormState] = useState({
    selectedUsers: [],
    description: "",
    amount: "",
    paidByUserId: activeUserId,
  });
  const [openPaidByList, setOpenPaidByList] = useState(null);

  useEffect(() => {
    fetchFriendsList();
    return () => {
      setFormState((prev) => ({
        ...prev,
        description: "",
        amount: "",
      }));
    };
  }, [open]);

  useEffect(() => {
    if (currentFriend)
      setFormState((prev) => ({ ...prev, selectedUsers: [currentFriend] }));
  }, [currentFriend]);

  const fetchFriendsList = async () => {
    try {
      const users = await getFriends();
      setUserList(users);
    } catch (error) {}
  };

  const handleEnterPress = async (name) => {
    const id = await signUp({ name });
    await addFriend({ id });
    const newFriend = { name, id };
    setUserList((prev) => [...prev, newFriend]);
    setFormState((prev) => ({
      ...prev,
      selectedUsers: [...prev.selectedUsers, newFriend],
    }));
  };

  const handleOpenPaidList = (evt) => {
    setOpenPaidByList(evt.currentTarget);
  };

  const handleClosePaidList = (evt) => {
    setOpenPaidByList(null);
  };

  const handleOnSelect = (options) => {
    const foundIndex = options.findIndex(
      ({ id }) => id === formState.paidByUserId
    );
    if (foundIndex === -1)
      setFormState((prev) => ({ ...prev, paidByUserId: paidByList[0].id }));
    setFormState((prev) => ({ ...prev, selectedUsers: options }));
  };

  const validateFormData = () => {
    const { selectedUsers, description, amount } = formState;
    let error = "";

    if (!selectedUsers.length)
      error = error.concat("No user selected for splitting.\n");
    if (!description.trim()) error = error.concat(`No description added.\n`);
    if (isValidNumber(amount)) {
      if (+amount <= 0)
        error = error.concat(`Amount should be greater than 0.\n`);
    } else {
      error = error.concat(`Not a valid amount.\n`);
    }

    return error;
  };

  const handleSave = async () => {
    const { paidByUserId, selectedUsers, description, amount } = formState;

    const error = validateFormData();
    if (error) return alert(error);

    const amountScale2 = +(+amount).toFixed(2);

    const userSplit = [{ id: activeUserId }, ...selectedUsers].map(
      ({ id }) => ({
        id,
        paid: id === paidByUserId ? amountScale2 : 0,
        owed: +(amountScale2 / (selectedUsers.length + 1)).toFixed(2),
      })
    );

    const activity = { description, userSplit };

    try {
      const data = await addExpense(activity);
      onSuccess(data);
    } catch (error) {}
  };

  const handleInputFieldChange = ({ name, value }) => {
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const paidByList = useMemo(
    () => [{ name: "you", id: activeUserId }, ...formState.selectedUsers],
    [formState.selectedUsers]
  );

  const paidByUserDetails = useMemo(
    () => paidByList.find(({ id }) => id === formState.paidByUserId),
    [paidByList, formState.paidByUserId]
  );

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
          <Stack gap={2} height="100%">
            <Typography fontSize="18px" fontWeight={600}>
              Add Expenses
            </Typography>
            <AutoComplete
              label="Select user(s)"
              isMultiSelect={true}
              options={userList}
              value={formState.selectedUsers}
              onSelect={(option) => {
                handleOnSelect(option);
              }}
              optionLabel="name"
              onEnterPress={handleEnterPress}
              placeholder="Select the user(s)"
            />

            <TextField
              fullWidth
              name="description"
              value={formState.description}
              onChange={({ target }) => handleInputFieldChange(target)}
              label="Enter Description"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Enter Amount"
              name="amount"
              value={formState.amount}
              onChange={({ target }) => handleInputFieldChange(target)}
              variant="outlined"
            />

            <Typography>
              Paid by{" "}
              <Chip
                label={paidByUserDetails?.name}
                onClick={handleOpenPaidList}
              />{" "}
              and split equally
            </Typography>
          </Stack>

          <Stack
            direction="row"
            position="absolute"
            bottom={0}
            right={0}
            p={2}
            gap={1}
          >
            <Button
              size="small"
              sx={{ mt: 4, width: "100%" }}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              size="small"
              sx={{ mt: 4, width: "100%" }}
              onClick={handleSave}
            >
              Save
            </Button>
          </Stack>
          <Popover
            open={openPaidByList}
            anchorEl={openPaidByList}
            onClose={handleClosePaidList}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <List sx={{ width: "200px" }}>
              {paidByList.map((user) => {
                return (
                  <ListItem key={user.name} disableGutters disablePadding>
                    <ListItemButton
                      selected={user.id === formState.paidByUserId}
                      disablePadding
                      disableRipple
                      disableGutters
                      sx={{ pt: 0, pb: 0 }}
                      onClick={() => {
                        setFormState((prev) => ({
                          ...prev,
                          paidByUserId: user.id,
                        }));
                        handleClosePaidList();
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: "fit-content", mr: 1 }}>
                        <PersonIcon />
                      </ListItemIcon>
                      <ListItemText primary={user.name} />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Popover>
        </Box>
      </Fade>
    </Modal>
  );
}

export default AddExpenseModal;
