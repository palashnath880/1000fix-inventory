import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/__auth")({
  beforeLoad: ({ context: { auth } }) => {
    const { isLogged } = auth;
    if (isLogged) {
      return redirect({ to: "/" });
    }
  },
});
