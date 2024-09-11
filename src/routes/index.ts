import Login from "./auth/login";
import Branch from "./manager/branch";
import SKUCode from "./manager/sku-code";
import Users from "./manager/users";

const Routes: { [key: string]: React.FC } = {
  Login: Login,
  SKUCode: SKUCode,
  Branch: Branch,
  Users: Users,
};

export default Routes;
