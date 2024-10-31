import { Button } from "@mui/material";
import { Header } from "../../../../components/shared/TopBar";
import { useAppSelector } from "../../../../hooks";

import CSCSentFaulty from "../../../../components/manager/CSCSentFaulty";
import OwnFaultyStock from "../../../../components/manager/OwnFaultyStock";
import SendFaulty from "../../../../components/manager/SendFaulty";
import { createFileRoute, Link } from "@tanstack/react-router";

function FaultyStock() {
  // redux
  const { user } = useAppSelector((state) => state.auth);

  return (
    <>
      <Header title="Faulty Stock" />
      <div className="flex justify-between mb-5">
        <div className="flex items-center gap-4">
          <Link
            to={"/csc/stock/faulty/report"}
            search={{ fromDate: "", toDate: "" }}
          >
            <Button>Faulty Report</Button>
          </Link>
          {user?.role !== "admin" && <SendFaulty />}
        </div>
      </div>

      {/* if user role id admin */}
      {user?.role === "admin" && <CSCSentFaulty />}

      <OwnFaultyStock />
    </>
  );
}

export const Route = createFileRoute("/csc/stock/faulty/")({
  component: FaultyStock,
});
