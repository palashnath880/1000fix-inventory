import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
  useSearchParams,
} from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import Loader from "../components/shared/Loader";
import { useEffect } from "react";
import { loadUser } from "../features/authSlice";
import engineerRoutes from "../routes/engineer/route";
import routes from "../routes/manager/route";
import Login from "../routes/auth/login";

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
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Outlet />
        </ProtectedRoute>
      ),
      children: [...routes, ...engineerRoutes],
    },
    {
      path: "/login",
      element: (
        <AuthRoute>
          <Login />
        </AuthRoute>
      ),
    },
  ]);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  if (loading && !user) {
    return <Loader />;
  }

  return <RouterProvider router={router} />;
}
