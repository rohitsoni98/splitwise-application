import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import App from "./App";

const theme = createTheme({
  palette: {
    primary: {
      main: "#48be9d",
    },
    secondary: {
      main: "#ff652f",
    },
    text: {
      faded: "#7D7D7D",
    },
    background: {
      paper: "",
    },
    container: {
      light: "#f6f6f6",
      main: "#eeeeee",
    },
  },
});

const root = createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </BrowserRouter>
);
