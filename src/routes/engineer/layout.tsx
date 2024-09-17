import { Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useEffect, useState } from "react";
import {
  BarChart,
  Home,
  KeyboardReturn,
  Menu,
  ShowChart,
} from "@mui/icons-material";
import { fetchSku } from "../../features/skuCodeSlice";
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

export default function Layout() {
  // states
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  // react redux
  const { user } = useAppSelector((state) => state.auth);
  const splitName = user?.name?.split(" ")[0];
  const dispatch = useAppDispatch();

  // const menus array
  const menus = [
    {
      href: "/engineer",
      name: "Own Stock",
      Icon: Home,
    },
    {
      href: "/engineer/stock-receive",
      name: "Stock Receive",
      Icon: BarChart,
    },
    {
      href: "/engineer/stock-return",
      name: "Stock Return",
      Icon: KeyboardReturn,
    },
    {
      href: "/engineer/stock-report",
      name: "Stock Report",
      Icon: ShowChart,
    },
    {
      href: "/engineer/faulty-return",
      name: "Faulty Return",
      Icon: KeyboardReturn,
    },
  ];

  useEffect(() => {
    dispatch(fetchSku(""));
  }, [dispatch]);

  return (
    <>
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
              <MenuItem
                key={index}
                onClick={() => {
                  navigate(menu.href);
                  setIsOpen(false);
                }}
              >
                <ListItemIcon>
                  <menu.Icon />
                </ListItemIcon>
                <ListItemText>{menu.name}</ListItemText>
              </MenuItem>
            ))}
          </List>
        </div>
      </Drawer>
    </>
  );
}
