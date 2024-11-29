import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/engineer")({
  beforeLoad: ({
    context: {
      auth: { isLogged, user },
    },
  }) => {
    if (isLogged) {
      if (user?.role !== "engineer") {
        return redirect({ to: "/csc" });
      }
    } else {
      return redirect({ to: "/login" });
    }
  },
});
