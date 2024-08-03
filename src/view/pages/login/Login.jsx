import React, { useEffect, useState } from "react";
import {
  Stack,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
} from "@mui/material";
import AutoComplete from "../../component/autoComplete/AutoComplete";
import { getUsers, login, signUp } from "../../../service/user";

function Login() {
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUserList();
  }, []);

  const fetchUserList = async () => {
    try {
      const users = await getUsers();
      setUserList(users);
    } catch (error) {}
  };

  const handleEnterPress = async (name) => {
    const id = await signUp({ name });
    setSelectedUser({ name, id });
  };

  const handleLoginClick = async () => {
    const activeUserId = await login(selectedUser);
    localStorage.setItem("activeUserId", activeUserId);
    window.location = "/dashboard";
  };

  return (
    <Stack
      width="100%"
      height={"calc(100vh - 50px)"}
      justifyContent="center"
      alignItems="center"
    >
      <Card
        sx={{
          maxWidth: "50%",
          minWidth: "40%",
          height: "400px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <CardContent sx={{ width: "100%" }}>
          <Typography
            fontSize="25px"
            textAlign="center"
            fontWeight={600}
            mb={4}
          >
            Login to continue
          </Typography>
          <AutoComplete
            label="Create or select a user"
            options={userList}
            value={selectedUser}
            onSelect={(option) => {
              setSelectedUser(option);
            }}
            optionLabel="name"
            onEnterPress={handleEnterPress}
            matchNotFoundMessage={"Type and hit enter to create an account"}
            placeholder="Create an user by typing name or select an user"
          />

          <Button
            variant="contained"
            size="small"
            sx={{ mt: 4, width: "100%" }}
            disabled={!selectedUser}
            onClick={handleLoginClick}
          >
            Login
          </Button>
        </CardContent>
      </Card>
    </Stack>
  );
}

export default Login;
