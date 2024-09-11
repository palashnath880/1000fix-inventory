import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import LayoutProvider from "./LayoutProvider";
import { useAppDispatch, useAppSelector } from "../hooks";
import Loader from "../components/shared/Loader";
import { useEffect } from "react";
import { loadUser } from "../features/authSlice";
import Routes from "../routes";

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
  const url = window.location.href;

  if (!user && !loading) {
    return <Navigate to={`/login?redirectTo=${encodeURIComponent(url)}`} />;
  }
  return children;
};

export default function RoutesProvider() {
  // user
  const { loading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  //  router
  const adminRouter = createBrowserRouter([
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

  // const router = user?.role === "admin" ? adminRouter : authRouter;
  const router = adminRouter;

  useEffect(() => {
    dispatch(loadUser());
  }, []);

  if (loading) <Loader />;

  return <RouterProvider router={router} />;
}
