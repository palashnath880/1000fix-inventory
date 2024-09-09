import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "../routes/auth/login";
import LayoutProvider from "./LayoutProvider";
import SKUCode from "../routes/admin/sku-code";

export default function RoutesProvider() {
  const authRouter = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/",
      element: <LayoutProvider />,
      children: [
        { path: "/", element: <></> },
        { path: "/sku-code", element: <SKUCode /> },
      ],
    },
  ]);

  const router = authRouter;

  return <RouterProvider router={router} />;
}
