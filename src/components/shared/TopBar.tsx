import { Logout, Person } from "@mui/icons-material";
import {
  Avatar,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { logOut } from "../../features/authSlice";
import { useEffect } from "react";
import { setHeader } from "../../features/headerSlice";

export const Header = ({
  subtitle,
  title,
}: {
  title: string;
  subtitle?: string;
}) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    document.title = `Inventory - ${title}`;
    dispatch(setHeader({ title, subtitle }));
  }, [title, subtitle, dispatch]);

  return <></>;
};

export default function TopBar() {
  // react redux
  const { title, subtitle } = useAppSelector((state) => state.header);
  const dispatch = useAppDispatch();

  return (
    <div className="px-5 py-2 shadow-lg bg-slate-100">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <Typography className="!font-medium !text-lg">{title}</Typography>
          {subtitle && <Typography variant="body2">{subtitle}</Typography>}
        </div>
        <div className="flex items-center gap-3">
          <PopupState variant="popover">
            {(popupState) => (
              <>
                <Avatar
                  className="!cursor-pointer"
                  {...bindTrigger(popupState)}
                />
                <Menu
                  {...bindMenu(popupState)}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <MenuItem className="!w-[170px]">
                    <ListItemIcon>
                      <Person />
                    </ListItemIcon>
                    <ListItemText>Profile</ListItemText>
                  </MenuItem>
                  <MenuItem
                    className="!w-[170px]"
                    onClick={() => dispatch(logOut())}
                  >
                    <ListItemIcon>
                      <Logout />
                    </ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                  </MenuItem>
                </Menu>
              </>
            )}
          </PopupState>
        </div>
      </div>
    </div>
  );
}
