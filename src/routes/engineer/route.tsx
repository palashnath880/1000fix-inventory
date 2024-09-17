import { Navigate, RouteObject } from "react-router-dom";
import Layout from "./layout";
import OwnStock from "./own-stock";
import StockReceive from "./stock-receive";
import StockReport from "./stock-report";
import StockReturn from "./stock-return";
import FaultyReturn from "./faulty-return";
import React from "react";
import { useAppSelector } from "../../hooks";

const EngineerRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAppSelector((state) => state.auth);

  if (user?.role === "engineer") {
    return <>{children}</>;
  }
  if (user?.role === "admin" || user?.role === "manager") {
    return <Navigate to={"/"} replace />;
  }

  return <></>;
};

const engineerRoutes: RouteObject[] = [
  {
    path: "/engineer",
    element: (
      <EngineerRoute>
        <Layout />
      </EngineerRoute>
    ),
    children: [
      {
        path: "/engineer",
        element: <OwnStock />,
      },
      {
        path: "/engineer/stock-receive",
        element: <StockReceive />,
      },
      {
        path: "/engineer/stock-report",
        element: <StockReport />,
      },
      {
        path: "/engineer/stock-return",
        element: <StockReturn />,
      },
      {
        path: "/engineer/faulty-return",
        element: <FaultyReturn />,
      },
    ],
  },
];

export default engineerRoutes;
