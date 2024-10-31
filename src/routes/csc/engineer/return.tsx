import { createFileRoute } from "@tanstack/react-router";
import ReturnStockRe from "../../../components/manager/ReturnStock";
import ReturnStockReport from "../../../components/manager/ReturnStockReport";
import { Header } from "../../../components/shared/TopBar";

function ReturnStock() {
  return (
    <div className="pb-10">
      <Header title="Engineer return stock" />

      <ReturnStockRe type="return" />

      <ReturnStockReport type="return" />
    </div>
  );
}

export const Route = createFileRoute("/csc/engineer/return")({
  component: ReturnStock,
});
