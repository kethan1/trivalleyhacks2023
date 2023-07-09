import React, { useState } from "react";
// import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
// import LocalGroceryStoreOutlinedIcon from '@mui/icons-material/LocalGroceryStoreOutlined';
// import AutoGraphRoundedIcon from '@mui/icons-material/AutoGraphRounded';
// import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
// import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';
// import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { Link } from "react-router-dom";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Drawer from '@mui/material/Drawer';
import { ThemeProvider, createTheme } from "@mui/material/styles";

export default function MenuSidebar({ handleQuit }) {
  const [render, reRender] = useState(false);

  let courses = JSON.parse(localStorage.getItem("courses"));
  let sidebarData = [];
  if (courses != null) {
    sidebarData = courses.map(course => {
      return {
        title: course,
        link: `/course/${course}`
      }
    });
  }

  window.addEventListener('coursesUpdated', () => {
    reRender(!render);
  });

  return (
    <Box sx={{ display: 'flex', zIndex: "0" }}>
      <Drawer
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            backgroundColor: "#239072",
            color: "white"
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Typography style={{ textAlign: "center", fontSize: "1.5em", paddingTop: "10px", fontWeight: "bold" }}>
          StudySmart
        </Typography>
        <List>
          <ListItem key={"home"} disablePadding>
            <ListItemButton as={Link} to={"/"} selected={window.location.pathname == "/" ? true : false} style={{ color: "inherit" }}>
              <ListItemText primary={"Home"}></ListItemText>
            </ListItemButton>
          </ListItem>
          <Divider />
          {sidebarData.map((info, index) => (
            <ListItem key={info.title} disablePadding>
              <ListItemButton as={Link} to={info.link} selected={window.location.pathname == info.link ? true : false} style={{ color: "inherit" }}>
                <ListItemText primary={info.title}></ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}