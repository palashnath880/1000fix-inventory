import Login from "./auth/login";
import Branch from "./manager/branch";
import SKUCode from "./manager/sku-code";
import StockEntry from "./manager/stock-entry";
import Users from "./manager/users";

const Routes: { [key: string]: React.FC } = {
  Login: Login,
  SKUCode: SKUCode,
  Branch: Branch,
  Users: Users,
  StockEntry: StockEntry,
};

export default Routes;
