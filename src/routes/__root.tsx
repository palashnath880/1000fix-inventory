import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { AuthContext } from "../types/types";
import { ToastContainer } from "react-toastify";
import EngineerLayout from "../layouts/Engineer";
import CSCLayout from "../layouts/CSC";
import { Button } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

type RouterContext = {
  auth: AuthContext;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: Root,
  notFoundComponent: NotFound,
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

function NotFound() {
  return (
    <div className="h-[100vh] grid place-items-center">
      <div className="w-[415px] text-center flex-col items-center justify-center mx-auto gap-[100px]">
        <div>
          <h3 className="text-4xl md:text-[56px] leading-[64px] text-[#1A1C16]">
            Page Not Found
          </h3>
        </div>
        <div className="flex flex-col gap-6 mt-3">
          <div className="text-center">
            <p className="text-base leading-6 tracking-wider font-sans">
              The page you are looking for might have been removed had its name
              changed or is temporarily unavailable.
            </p>
          </div>
          <div>
            <Button
              startIcon={<ArrowBack />}
              className="!rounded-full !px-10 !text-sm !py-4"
              href="/"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
