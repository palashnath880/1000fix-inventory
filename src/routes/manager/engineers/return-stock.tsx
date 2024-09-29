import ReturnStockRe from "../../../components/manager/ReturnStock";
import ReturnStockReport from "../../../components/manager/ReturnStockReport";
import { Header } from "../../../components/shared/TopBar";

export default function ReturnStock() {
  return (
    <div className="pb-10">
      <Header title="Engineer return stock" />

      <ReturnStockRe type="return" />

      <ReturnStockReport type="return" />
    </div>
  );
}
