import {
  Article,
  BarChart,
  Home,
  Https,
  KeyboardReturn,
  Logout,
  Menu,
  ShowChart,
} from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Menu as PopupMenu,
  ListItem,
  ListItemButton,
} from "@mui/material";
import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state";
import React, { useEffect, useState } from "react";
import ChangePassword from "../components/shared/ChangePassword";
import { useAppDispatch, useAppSelector } from "../hooks";
import { fetchSku } from "../features/utilsSlice";
import { useNavigate } from "@tanstack/react-router";
import { logOut } from "../features/authSlice";

export default function EngineerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    {
      href: "/engineer/defective-report",
      name: "Defective Report",
      Icon: Article,
    },
  ];

  useEffect(() => {
    dispatch(fetchSku());
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
            <div className="flex flex-1 justify-end">
              <PopupState variant="popover">
                {(popup) => (
                  <>
                    <Avatar
                      sx={{ width: 30, height: 30 }}
                      {...bindTrigger(popup)}
                    />
                    <PopupMenu {...bindMenu(popup)}>
                      <ChangePassword>
                        {(popupState) => (
                          <ListItem className="!min-w-[150px] !px-0 !py-0">
                            <ListItemButton {...bindTrigger(popupState)}>
                              <ListItemIcon sx={{ minWidth: 40 }}>
                                <Https />
                              </ListItemIcon>
                              <ListItemText>Change Password</ListItemText>
                            </ListItemButton>
                          </ListItem>
                        )}
                      </ChangePassword>
                      <ListItem className="!min-w-[150px] !px-0 !py-0">
                        <ListItemButton onClick={() => dispatch(logOut())}>
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            <Logout />
                          </ListItemIcon>
                          <ListItemText>Logout</ListItemText>
                        </ListItemButton>
                      </ListItem>
                    </PopupMenu>
                  </>
                )}
              </PopupState>
            </div>
          </Toolbar>
        </AppBar>
        <div className="px-4 py-5">{children}</div>
      </Box>
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
              <ListItem key={index} className="!px-0 !py-0">
                <ListItemButton
                  onClick={() => {
                    navigate({ to: menu.href });
                    setIsOpen(false);
                  }}
                >
                  <ListItemIcon>
                    <menu.Icon />
                  </ListItemIcon>
                  <ListItemText>{menu.name}</ListItemText>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>
      ;
    </>
  );
}
