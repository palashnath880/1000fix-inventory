import { Navigate, RouteObject } from "react-router-dom";
import Home from "./home";
import SKUCode from "./admin-options/sku-code";
import Branch from "./admin-options/branch";
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
import Layout from "./layout";
import FaultyStock from "./engineers/faulty-stock";
import Defective from "./defective";
import Challan from "./challan";
import ChallanPdf from "./challan-pdf";
import ReturnStock from "./engineers/return-stock";
import PurchaseReturn from "./purchase-return";
import BranchStock from "./stock/branch-stock";
import EngineerStock from "./engineers/engineer-stock";
import TransferReport from "./engineers/transfer-report";
import ScrapReport from "./scrap-report";
import EnDefective from "./engineers/defective";
import CSCFaultyStock from "./stock/faulty-stock";
import FaultyReport from "./stock/faulty-report";
import JobEntrySummary from "./job/job-entry-summary";

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

const stockRoutes: RouteObject[] = [
  {
    path: "faulty",
    element: <CSCFaultyStock />,
  },
  {
    path: "faulty/report",
    element: <FaultyReport />,
  },
];

const enRoutes: RouteObject[] = [
  {
    path: "stock",
    element: <EngineerStock />,
  },
  {
    path: "faulty-stock",
    element: <FaultyStock />,
  },
  {
    path: "return-stock",
    element: <ReturnStock />,
  },
  {
    path: "transfer-report",
    element: <TransferReport />,
  },
  {
    path: "defective",
    element: <EnDefective />,
  },
];

const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <ManagerRoute>
        <Layout />
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
        path: "/stock",
        children: stockRoutes,
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
        path: "/branch-stock",
        element: <BranchStock />,
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
        path: "/job-entry-summary",
        element: <JobEntrySummary />,
      },
      {
        path: "/defective",
        element: <Defective />,
      },
      {
        path: "/challan",
        element: <Challan />,
      },
      {
        path: "/challan/:challanId",
        element: <ChallanPdf />,
      },
      {
        path: "/purchase-return",
        element: <PurchaseReturn />,
      },
      {
        path: "/scrap-report",
        element: <ScrapReport />,
      },
      {
        path: "/engineer",
        children: enRoutes,
      },
    ],
  },
];

export default routes;
