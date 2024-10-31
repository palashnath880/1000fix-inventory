import { Header } from "../../../components/shared/TopBar";
import ReturnStock from "../../../components/manager/ReturnStock";
import ReturnStockReport from "../../../components/manager/ReturnStockReport";
import { createFileRoute } from "@tanstack/react-router";

function FaultyStock() {
  return (
    <div className="pb-10">
      <Header title="Engineer faulty stock" />

      <ReturnStock type="faulty" />

      <ReturnStockReport type="faulty" />
    </div>
  );
}

export const Route = createFileRoute("/csc/engineer/faulty")({
  component: FaultyStock,
});
