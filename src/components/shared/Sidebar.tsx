import {
  AdfScanner,
  AdminPanelSettings,
  Approval,
  Article,
  Assessment,
  AssignmentReturn,
  AutoDelete,
  BarChart,
  CallReceived,
  Cancel,
  DisabledByDefault,
  EditNote,
  Group,
  Home,
  HomeWork,
  Inventory,
  KeyboardReturn,
  LocalShipping,
  // Send,
  Settings,
  SvgIconComponent,
  WorkHistory,
} from "@mui/icons-material";
import { useTheme } from "@mui/material";

import {
  Menu,
  MenuItem,
  Sidebar as ReactSidebar,
  SubMenu,
} from "react-pro-sidebar";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAppSelector } from "../../hooks";
import logo from "../../assets/logo.png";

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
      href: "",
      name: "Job Entry",
      Icon: WorkHistory,
      show: true,
      menus: [
        {
          href: "/job-entry",
          name: "Create Job",
          Icon: EditNote,
          show: true,
        },
        {
          href: "/job-entry-list",
          name: "Job Entry Report",
          Icon: Assessment,
          show: true,
        },
      ],
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
          href: "/branch-stock",
          name: "Branch Stock",
          Icon: HomeWork,
          show: user?.role === "admin",
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
        {
          href: "/stock/faulty",
          name: "Own Faulty Stock",
          Icon: Approval,
          show: true,
        },
      ],
    },
    {
      name: "Engineer",
      Icon: Group,
      show: true,
      menus: [
        {
          href: "/engineer/stock",
          name: "Engineer Stock",
          Icon: BarChart,
          show: true,
        },
        {
          href: "/engineer/transfer-report",
          name: "Transfer Report",
          Icon: Article,
          show: true,
        },
        {
          href: "/engineer/faulty-stock",
          name: "Faulty Stock",
          Icon: DisabledByDefault,
          show: true,
        },
        {
          href: "/engineer/return-stock",
          name: "Return Stock",
          Icon: KeyboardReturn,
          show: true,
        },
        {
          href: "/engineer/Defective",
          name: "Defective",
          Icon: KeyboardReturn,
          show: true,
        },
      ],
    },
    {
      href: "/defective",
      name: "Defective",
      Icon: Cancel,
      show: true,
    },
    {
      href: "/challan",
      name: "Challan",
      Icon: AdfScanner,
      show: user?.role === "admin",
    },
    {
      href: "/purchase-return",
      name: "Purchase Return",
      Icon: AssignmentReturn,
      show: user?.role === "admin",
    },
    {
      href: "/scrap-report",
      name: "Scrap Report",
      Icon: AutoDelete,
      show: user?.role === "admin",
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
          show: true,
        },
        {
          href: "/stock-entry",
          name: "Stock Entry",
          Icon: Settings,
          show: true,
        },
        {
          href: "/branch",
          name: "Branch",
          Icon: Settings,
          show: true,
        },
        {
          href: "/users",
          name: "Users",
          Icon: Settings,
          show: true,
        },
      ],
    },
  ];

  return (
    <aside className="h-full bg-primary px-4 py-5 overflow-y-auto overflow-x-hidden w-[260px] scrollbar">
      <div className="h-full flex flex-col gap-5">
        <div className="flex flex-col items-center">
          <Link to={"/"} title="1000fix Inventory">
            <img className="!w-36 !h-auto" src={logo} />
          </Link>
        </div>
        <div className="flex-1">
          <ReactSidebar
            rootStyles={{
              border: " none !important",
              "& .ps-sidebar-container": {
                backgroundColor: "transparent !important",
              },
              minWidth: "100%",
              width: "100%",
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
