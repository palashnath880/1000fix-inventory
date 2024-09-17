import {
  BarChart,
  Home,
  KeyboardReturn,
  Menu,
  ShowChart,
} from "@mui/icons-material";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { useAppSelector } from "../hooks";
import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function EngineerLayout() {
  // states
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  // react redux
  const { user } = useAppSelector((state) => state.auth);
  const splitName = user?.name?.split(" ")[0];

  // const menus array
  const menus = [
    {
      href: "/",
      name: "Home",
      Icon: Home,
    },
    {
      href: "/stock-receive",
      name: "Stock Receive",
      Icon: BarChart,
    },
    {
      href: "/stock-report",
      name: "Stock Report",
      Icon: ShowChart,
    },
    {
      href: "/faulty-return",
      name: "Faulty Return",
      Icon: KeyboardReturn,
    },
  ];

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="sticky">
          <Toolbar variant="dense">
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() => setIsOpen(true)}
            >
              <Menu />
            </IconButton>
            <Typography variant="h6" color="inherit" component="div">
              Hello, {splitName}
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      <div className="px-4 py-5">
        <Outlet />
      </div>

      {/* bottom menu drawer */}
      <Drawer
        anchor="bottom"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        sx={{
          "& .MuiPaper-root": {
            backgroundColor: "transparent !important",
          },
        }}
      >
        <div className="py-2 !rounded-t-2xl !bg-slate-50 ">
          <List>
            {menus.map((menu, index) => (
              <MenuItem key={index} onClick={() => navigate(menu.href)}>
                <ListItemIcon>
                  <menu.Icon />
                </ListItemIcon>
                <ListItemText>{menu.name}</ListItemText>
              </MenuItem>
            ))}
          </List>
        </div>
      </Drawer>
    </div>
  );
}
