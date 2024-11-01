import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { AuthContext } from "../types/types";
import { ToastContainer } from "react-toastify";
import EngineerLayout from "../layouts/Engineer";
import CSCLayout from "../layouts/CSC";

type RouterContext = {
  auth: AuthContext;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: Root,
});

function Root() {
  const { auth } = Route.useRouteContext();

  return (
    <>
      {auth.isLogged ? (
        auth.user?.role === "engineer" ? (
          <EngineerLayout>
            <Outlet />
          </EngineerLayout>
        ) : (
          <CSCLayout context={auth}>
            <Outlet />
          </CSCLayout>
        )
      ) : (
        <Outlet />
      )}

      <style>{`.Toastify__close-button{align-self:center !important;}`}</style>
      <ToastContainer
        hideProgressBar={true}
        toastClassName={"!min-h-[50px]"}
        bodyClassName={"!my-0 !py-0 !items-center !text-sm"}
      />
    </>
  );
}
