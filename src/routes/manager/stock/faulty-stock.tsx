import { Button } from "@mui/material";
import { Header } from "../../../components/shared/TopBar";
import { useAppSelector } from "../../../hooks";
import { Link } from "react-router-dom";
import CSCSentFaulty from "../../../components/manager/CSCSentFaulty";
import OwnFaultyStock from "../../../components/manager/OwnFaultyStock";
import SendFaulty from "../../../components/manager/SendFaulty";

export default function CSCFaultyStock() {
  // redux
  const { user } = useAppSelector((state) => state.auth);

  return (
    <>
      <Header title="Faulty Stock" />
      <div className="flex justify-between mb-5">
        <div className="flex items-center gap-4">
          <Link to={"report"}>
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
