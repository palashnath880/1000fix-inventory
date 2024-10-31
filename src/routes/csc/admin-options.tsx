import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/csc/admin-options")({
  beforeLoad: ({
    context: {
      auth: { user },
    },
  }) => {
    if (user?.role !== "admin") {
      return redirect({ to: "/csc" });
    }
  },
});
