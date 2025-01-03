import { useAppDispatch, useAppSelector } from "../hooks";
import {
  createRouter,
  RouterProvider as Provider,
} from "@tanstack/react-router";
import { routeTree } from "../routeTree.gen";
import { useEffect } from "react";
import { authUser } from "../features/authSlice";
import Loader from "../components/shared/Loader";

export const router = createRouter({
  routeTree,
  context: { auth: undefined! },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function RouterProvider() {
  // react redux
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const isLogged = Boolean(auth?.user);

  useEffect(() => {
    dispatch(authUser());
  }, [dispatch]);

  if (auth.loading) return <Loader />;

  return <Provider router={router} context={{ auth: { ...auth, isLogged } }} />;
}
