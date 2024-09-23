import AddChallan from "../../components/manager/AddChallan";
import { Header } from "../../components/shared/TopBar";

export default function Challan() {
  return (
    <div className="pb-10">
      <Header title="Challan" />

      <div className="flex items-center justify-between">
        <div></div>
        <div className="flex items-center gap-4">
          <AddChallan />
        </div>
      </div>
    </div>
  );
}
