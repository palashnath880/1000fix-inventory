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
import { useAppSelector } from "../../hooks";
import logo from "../../assets/logo.png";
import { Link, useLocation } from "@tanstack/react-router";

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

const MySubMenu = ({
  Icon,
  name,
  menus,
}: {
  name: string;
  Icon: SvgIconComponent;
  show?: boolean;
  menus?: {
    href: string;
    name: string;
    Icon: SvgIconComponent;
    show?: boolean;
  }[];
}) => {
  // location
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <SubMenu
      icon={<Icon fontSize="medium" />}
      label={name}
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
      defaultOpen={!!menus?.find((i) => i.href === pathname)}
    >
      {menus?.map(
        (menu, index) =>
          menu.show && (
            <MenuItem
              key={index}
              component={
                menu.href && (
                  <Link
                    to={menu.href}
                    activeProps={{
                      className: `!bg-[#f8f8ff85]`,
                    }}
                  />
                )
              }
              icon={<menu.Icon fontSize="medium" />}
            >
              {menu.name}
            </MenuItem>
          )
      )}
    </SubMenu>
  );
};

export default function Sidebar() {
  const { user } = useAppSelector((state) => state.auth);
  const role = user?.role;

  // mui theme
  const theme = useTheme();

  // menus array
  const menus: Menu[] = [
    {
      href: "/csc/",
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
          href: "/csc/job/entry",
          name: "Create Job",
          Icon: EditNote,
          show: true,
        },
        {
          href: "/csc/job/entry-list",
          name: "Job Entry Report",
          Icon: Assessment,
          show: true,
        },
        {
          href: "/csc/job/entry-summary",
          name: "Job Entry Summary",
          Icon: Assessment,
          show: user?.role === "admin",
        },
      ],
    },
    {
      name: "Stock Inquiry",
      Icon: BarChart,
      show: true,
      menus: [
        {
          href: "/csc/stock/own",
          name: "Own Stock",
          Icon: Inventory,
          show: true,
        },
        {
          href: "/csc/stock/branch",
          name: "CSC Stock",
          Icon: HomeWork,
          show: user?.role === "admin",
        },
        {
          href: "/csc/stock/transfer",
          name: "Stock Transfer",
          Icon: LocalShipping,
          show: true,
        },
        {
          href: "/csc/stock/receive",
          name: "Stock Receive",
          Icon: CallReceived,
          show: role === "manager",
        },
        {
          href: "/csc/stock/return",
          name: "Stock Return",
          Icon: KeyboardReturn,
          show: role === "manager",
        },
        {
          href: "/csc/stock/approval",
          name: "Stock Approval",
          Icon: Approval,
          show: role === "admin",
        },
        {
          href: "/csc/stock/faulty",
          name: "Faulty Stock",
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
          href: "/csc/engineer/stock",
          name: "Engineer Stock",
          Icon: BarChart,
          show: true,
        },
        {
          href: "/csc/engineer/transfer-report",
          name: "Transfer Report",
          Icon: Article,
          show: true,
        },
        {
          href: "/csc/engineer/faulty",
          name: "Faulty Stock",
          Icon: DisabledByDefault,
          show: true,
        },
        {
          href: "/csc/engineer/return",
          name: "Return Stock",
          Icon: KeyboardReturn,
          show: true,
        },
        {
          href: "/csc/engineer/defective",
          name: "Defective",
          Icon: KeyboardReturn,
          show: true,
        },
      ],
    },
    {
      href: "/csc/defective",
      name: "Defective",
      Icon: Cancel,
      show: true,
    },
    {
      href: "/csc/challan",
      name: "Challan",
      Icon: AdfScanner,
      show: user?.role === "admin",
    },
    {
      href: "/csc/purchase-return",
      name: "Purchase Return",
      Icon: AssignmentReturn,
      show: user?.role === "admin",
    },
    {
      href: "/csc/scrap-report",
      name: "Scrap Report",
      Icon: AutoDelete,
      show: user?.role === "admin",
    },
    {
      href: "/csc/aging-report",
      name: "Aging Report",
      Icon: Article,
      show: true,
    },
    {
      name: "Admin Options",
      Icon: AdminPanelSettings,
      show: role === "admin",
      menus: [
        {
          href: "/csc/admin-options/sku-code",
          name: "SKU Code",
          Icon: Settings,
          show: true,
        },
        {
          href: "/csc/admin-options/stock-entry",
          name: "Stock Entry",
          Icon: Settings,
          show: true,
        },
        {
          href: "/csc/admin-options/branch",
          name: "CSC",
          Icon: Settings,
          show: true,
        },
        {
          href: "/csc/admin-options/users",
          name: "Users",
          Icon: Group,
          show: true,
        },
      ],
    },
  ];

  return (
    <aside className="h-full bg-primary px-4 overflow-y-auto overflow-x-hidden w-[260px] scrollbar">
      <div className="py-5 flex flex-col gap-5">
        <div className="flex flex-col items-center">
          <Link to={"/csc"} title="1000fix Inventory">
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
                    <MySubMenu {...menu} key={index} />
                  ) : (
                    <MenuItem
                      key={index}
                      component={menu.href && <Link to={menu.href} />}
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
