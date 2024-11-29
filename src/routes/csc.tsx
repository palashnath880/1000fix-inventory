import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/csc")({
  beforeLoad: ({
    context: {
      auth: { isLogged, user },
    },
  }) => {
    if (isLogged) {
      if (user?.role !== "admin" && user?.role !== "manager") {
        return redirect({ to: "/engineer", search: { skuId: "" } });
      }
    } else {
      return redirect({ to: "/login" });
    }
  },
});
