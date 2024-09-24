import ReturnStockReport from "../../../components/manager/ReturnStock";
import { Header } from "../../../components/shared/TopBar";

export default function ReturnStock() {
  return (
    <div className="pb-10">
      <Header title="Engineer return stock" />

      <ReturnStockReport type="return" />
    </div>
  );
}
