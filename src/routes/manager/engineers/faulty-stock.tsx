import { Header } from "../../../components/shared/TopBar";
import ReturnStock from "../../../components/manager/ReturnStock";

export default function FaultyStock() {
  return (
    <div className="pb-10">
      <Header title="Engineer faulty stock" />

      <ReturnStock type="faulty" />
    </div>
  );
}
