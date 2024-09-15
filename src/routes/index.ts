import Login from "./auth/login";
import Branch from "./manager/branch";
import JobEntry from "./manager/job/job-entry";
import JobEntryList from "./manager/job/job-entry-list";
import SKUCode from "./manager/sku-code";
import StockEntry from "./manager/stock-entry";
import OwnStock from "./manager/stock/own-stock";
import StockApproval from "./manager/stock/stock-approval";
import StockReceive from "./manager/stock/stock-receive";
import StockTransfer from "./manager/stock/stock-transfer";
import Users from "./manager/users";

const Routes: { [key: string]: React.FC } = {
  Login: Login,
  SKUCode: SKUCode,
  Branch: Branch,
  Users: Users,
  StockEntry: StockEntry,
  OwnStock: OwnStock,
  StockTransfer,
  StockReceive,
  JobEntry,
  JobEntryList,
  StockApproval,
};

export default Routes;
