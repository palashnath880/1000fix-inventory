import Login from "./auth/login";
import Branch from "./manager/branch";
import SKUCode from "./manager/sku-code";

const Routes: { [key: string]: React.FC } = {
  Login: Login,
  SKUCode: SKUCode,
  Branch: Branch,
};

export default Routes;
