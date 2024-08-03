import React from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { Link } from "react-router-dom";

function FriendListing({ friendList, filterFn }) {
  return (
    <List>
      {friendList.filter(filterFn).map(({ name, id, balance }) => {
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
              <ListItemAvatar>
                <Avatar>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>

              <ListItemText primary={name} secondary={balance} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}

export default FriendListing;
