import {
  AdminPanelSettings,
  Approval,
  BarChart,
  CallReceived,
  Group,
  Home,
  Inventory,
  KeyboardReturn,
  LocalShipping,
  Send,
  Settings,
  SvgIconComponent,
  WorkHistory,
} from "@mui/icons-material";
import { Typography, useTheme } from "@mui/material";

import {
  Menu,
  MenuItem,
  Sidebar as ReactSidebar,
  SubMenu,
} from "react-pro-sidebar";
import { NavLink, useLocation } from "react-router-dom";
import { useAppSelector } from "../../hooks";

type Menu = {
  href?: string;
  name: string;
  Icon: SvgIconComponent;
  show?: boolean;
  menus?: {
    href: string;
    name: string;
    Icon: SvgIconComponent;
    show?: boolean;
  }[];
};

export default function Sidebar() {
  const { user } = useAppSelector((state) => state.auth);
  const role = user?.role;

  // mui theme
  const theme = useTheme();

  // path name
  const location = useLocation();
  const pathname = location.pathname;

  // menus array
  const menus: Menu[] = [
    {
      href: "/",
      name: "Home",
      Icon: Home,
      show: true,
    },
    {
      href: "/job-entry",
      name: "Job Entry",
      Icon: WorkHistory,
      show: true,
    },
    {
      name: "Stock Inquiry",
      Icon: BarChart,
      show: true,
      menus: [
        {
          href: "/own-stock",
          name: "Own Stock",
          Icon: Inventory,
          show: true,
        },
        {
          href: "/stock-transfer",
          name: "Stock Transfer",
          Icon: LocalShipping,
          show: true,
        },
        {
          href: "/stock-receive",
          name: "Stock Receive",
          Icon: CallReceived,
          show: role === "manager",
        },
        {
          href: "/stock-return",
          name: "Stock Return",
          Icon: KeyboardReturn,
          show: role === "manager",
        },
        {
          href: "/stock-approval",
          name: "Stock Approval",
          Icon: Approval,
          show: role === "admin",
        },
      ],
    },
    {
      name: "Engineers",
      Icon: Group,
      show: true,
      menus: [
        {
          href: "/send-product",
          name: "Send Product",
          Icon: Send,
          show: true,
        },
      ],
    },
    {
      name: "Admin Options",
      Icon: AdminPanelSettings,
      show: role === "admin",
      menus: [
        {
          href: "/sku-code",
          name: "SKU Code",
          Icon: Settings,
        },
        {
          href: "/stock-entry",
          name: "Stock Entry",
          Icon: Settings,
        },
        {
          href: "/branch",
          name: "Branch",
          Icon: Settings,
        },
        {
          href: "/users",
          name: "Users",
          Icon: Settings,
        },
      ],
    },
  ];

  return (
    <aside className="h-full bg-primary px-4 py-5">
      <div className="h-full flex flex-col gap-5">
        <div className="flex flex-col items-center">
          <img className="" src="" />
          <Typography variant="h5" color="secondary">
            Branch name
          </Typography>
        </div>
        <div className="flex-1">
          <ReactSidebar
            rootStyles={{
              border: " none !important",
              "& .ps-sidebar-container": {
                backgroundColor: "transparent !important",
              },
            }}
          >
            <Menu
              menuItemStyles={{
                button: {
                  color: theme.palette.secondary.main,
                  paddingRight: 5,
                  paddingLeft: 5,
                  borderRadius: 8,
                  fontSize: 15,
                  height: 46,
                  ":hover": {
                    backgroundColor: `${theme.palette.secondary.main}85`,
                  },
                  "&.active": {
                    backgroundColor: `${theme.palette.secondary.main}85`,
                    fontWeight: 600,
                  },
                },
              }}
            >
              {menus.map(
                (menu, index) =>
                  menu.show &&
                  (menu?.menus ? (
                    <SubMenu
                      key={index}
                      icon={<menu.Icon fontSize="medium" />}
                      label={menu.name}
                      rootStyles={{
                        "& .ps-submenu-content": {
                          backgroundColor: "transparent !important",
                          paddingLeft: 20,
                        },
                        "& .ps-submenu-expand-icon": {
                          paddingRight: 10,
                          display: "flex",
                        },
                      }}
                      defaultOpen={
                        !!menu?.menus?.find((i) => i.href === pathname)
                      }
                    >
                      {menu?.menus?.map(
                        (submenu, subIndex) =>
                          submenu.show && (
                            <MenuItem
                              key={subIndex}
                              component={
                                submenu.href && <NavLink to={submenu.href} />
                              }
                              icon={<submenu.Icon fontSize="medium" />}
                            >
                              {submenu.name}
                            </MenuItem>
                          )
                      )}
                    </SubMenu>
                  ) : (
                    <MenuItem
                      key={index}
                      component={menu.href && <NavLink to={menu.href} />}
                      icon={<menu.Icon fontSize="medium" />}
                    >
                      {menu.name}
                    </MenuItem>
                  ))
              )}
            </Menu>
          </ReactSidebar>
        </div>
      </div>
    </aside>
  );
}
