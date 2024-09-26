import { Header } from "../../../components/shared/TopBar";
import StockReturnForm from "../../../components/stock/StockReturnForm";

export default function StockReturn() {
  return (
    <div className="pb-10">
      <Header title="Stock Return" />

      <StockReturnForm />
    </div>
  );
}
