import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  useSearchParams,
} from "react-router-dom";
import LayoutProvider from "./LayoutProvider";
import { useAppDispatch, useAppSelector } from "../hooks";
import Loader from "../components/shared/Loader";
import { useEffect } from "react";
import { loadUser } from "../features/authSlice";
import Routes from "../routes";
import EngineerLayout from "./EngineerLayout";
import StockReceive from "../routes/engineer/stock-receive";
import OwnStock from "../routes/engineer/own-stock";
import FaultyReturn from "../routes/engineer/faulty-return";

const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  // user
  const { user, loading } = useAppSelector((state) => state.auth);
  if (user && !loading) {
    return <Navigate to={"/"} />;
  }
  return children;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // user
  const { user, loading } = useAppSelector((state) => state.auth);
  const [params, setParams] = useSearchParams(window.location.search);
  const url = window.location.pathname;

  if (!user && !loading) {
    setParams((param) => {
      param.set("redirectTo", url);
      return param;
    });
    return <Navigate to={`/login?${params.toString()}`} />;
  }
  return children;
};

export default function RoutesProvider() {
  // user
  const { loading, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  //  router
  const managerRouter = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <LayoutProvider />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/sku-code",
          element: <Routes.SKUCode />,
        },
        {
          path: "/branch",
          element: <Routes.Branch />,
        },
        {
          path: "/users",
          element: <Routes.Users />,
        },
        {
          path: "/stock-entry",
          element: <Routes.StockEntry />,
        },
        {
          path: "/own-stock",
          element: <Routes.OwnStock />,
        },
        {
          path: "/stock-transfer",
          element: <Routes.StockTransfer />,
        },
        {
          path: "/stock-receive",
          element: <Routes.StockReceive />,
        },
        {
          path: "/stock-approval",
          element: <Routes.StockApproval />,
        },
        {
          path: "/stock-return",
          element: <Routes.StockReturn />,
        },
        {
          path: "/job-entry",
          element: <Routes.JobEntry />,
        },
        {
          path: "/job-entry-list",
          element: <Routes.JobEntryList />,
        },
        {
          path: "/engineers",
          children: [
            {
              path: "/engineers/send-stock",
              element: <Routes.SendStock />,
            },
          ],
        },
      ],
    },
    {
      path: "/login",
      element: (
        <AuthRoute>
          <Routes.Login />
        </AuthRoute>
      ),
    },
  ]);

  // engineer router
  const engineerRouter = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <EngineerLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/",
          element: <OwnStock />,
        },
        {
          path: "/stock-receive",
          element: <StockReceive />,
        },
        {
          path: "/faulty-return",
          element: <FaultyReturn />,
        },
      ],
    },
  ]);

  const router = user?.role === "engineer" ? engineerRouter : managerRouter;

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  if (loading && !user) {
    return <Loader />;
  }

  return <RouterProvider router={router} />;
}
