import {
  AdminPanelSettings,
  Approval,
  BarChart,
  CallReceived,
  Home,
  LocalShipping,
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
    },
    {
      href: "/job-entry",
      name: "Job Entry",
      Icon: WorkHistory,
    },
    {
      name: "Stock Inquiry",
      Icon: BarChart,
      menus: [
        {
          href: "/stock-transfer",
          name: "Stock Transfer",
          Icon: LocalShipping,
        },
        {
          href: "/stock-receive",
          name: "Stock Receive",
          Icon: CallReceived,
        },
        {
          href: "/stock-approval",
          name: "Stock Approval",
          Icon: Approval,
        },
      ],
    },
    {
      name: "Admin Options",
      Icon: AdminPanelSettings,
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
              {menus.map((menu, index) =>
                menu?.menus ? (
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
                    {menu?.menus?.map((submenu, subIndex) => (
                      <MenuItem
                        key={subIndex}
                        component={
                          submenu.href && <NavLink to={submenu.href} />
                        }
                        icon={<submenu.Icon fontSize="medium" />}
                      >
                        {submenu.name}
                      </MenuItem>
                    ))}
                  </SubMenu>
                ) : (
                  <MenuItem
                    key={index}
                    component={menu.href && <NavLink to={menu.href} />}
                    icon={<menu.Icon fontSize="medium" />}
                  >
                    {menu.name}
                  </MenuItem>
                )
              )}
            </Menu>
          </ReactSidebar>
        </div>
      </div>
    </aside>
  );
}
