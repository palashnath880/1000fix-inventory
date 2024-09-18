import { Navigate, Outlet, RouteObject } from "react-router-dom";
import Home from "./home";
import SKUCode from "./sku-code";
import Branch from "./branch";
import Users from "./users";
import StockEntry from "./stock-entry";
import OwnStock from "./stock/own-stock";
import StockTransfer from "./stock/stock-transfer";
import StockReturn from "./stock/stock-return";
import StockApproval from "./stock/stock-approval";
import StockReceive from "./stock/stock-receive";
import JobEntry from "./job/job-entry";
import JobEntryList from "./job/job-entry-list";
import React from "react";
import { useAppSelector } from "../../hooks";

const ManagerRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAppSelector((state) => state.auth);

  if (user?.role === "admin" || user?.role === "manager") {
    return <>{children}</>;
  }

  if (user?.role === "engineer") {
    return <Navigate to={"/engineer"} replace />;
  }

  return <></>;
};

const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <ManagerRoute>
        <Outlet />
      </ManagerRoute>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/sku-code",
        element: <SKUCode />,
      },
      {
        path: "/branch",
        element: <Branch />,
      },
      {
        path: "/users",
        element: <Users />,
      },
      {
        path: "/stock-entry",
        element: <StockEntry />,
      },
      {
        path: "/own-stock",
        element: <OwnStock />,
      },
      {
        path: "/stock-transfer",
        element: <StockTransfer />,
      },
      {
        path: "/stock-receive",
        element: <StockReceive />,
      },
      {
        path: "/stock-approval",
        element: <StockApproval />,
      },
      {
        path: "/stock-return",
        element: <StockReturn />,
      },
      {
        path: "/job-entry",
        element: <JobEntry />,
      },
      {
        path: "/job-entry-list",
        element: <JobEntryList />,
      },
      {
        path: "/engineers",
        children: [],
      },
    ],
  },
];

export default routes;
