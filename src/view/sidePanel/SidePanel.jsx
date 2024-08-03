import React from "react";
import { Link, useLocation } from "react-router-dom";
import sidePanelConfig from "./sidePanelConfig";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
} from "@mui/material";
import "./sidePanel.scss";
import Friends from "./friends/Friends";

function SidePanel() {
  const activePathName = useLocation().pathname;
  return (
    <Stack flexGrow={0.7} alignItems="end">
      <Box maxWidth={150} mr={4}>
        <List>
          {sidePanelConfig.map(({ name, pathName, Icon }) => {
            const active = activePathName === pathName;
            const color = active ? "primary.main" : "text.faded";
            return (
              <ListItem key={name} disableGutters disablePadding>
                <ListItemButton
                  component={Link}
                  to={pathName}
                  disablePadding
                  disableRipple
                  disableGutters
                  sx={{ pt: 0, pb: 0 }}
                >
                  <ListItemIcon sx={{ minWidth: "fit-content", mr: 1 }}>
                    <Icon sx={{ color }} />
                  </ListItemIcon>
                  <ListItemText primary={name} sx={{ color }} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        <Friends />
      </Box>
    </Stack>
  );
}

export default SidePanel;
