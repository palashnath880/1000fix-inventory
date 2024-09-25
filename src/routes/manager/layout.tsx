import { useEffect } from "react";
import { useAppDispatch } from "../../hooks";
import { fetchSku } from "../../features/skuCodeSlice";
import { fetchUsers } from "../../features/userSlice";
import { fetchItems } from "../../features/itemSlice";
import { fetchModels } from "../../features/modelSlice";
import { fetchCategories } from "../../features/categorySlice";
import TopBar from "../../components/shared/TopBar";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/shared/Sidebar";
import { fetchBranch } from "../../features/branchSlice";

export default function Layout() {
  const dispatch = useAppDispatch();

  // fetch users
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchBranch(""));
    dispatch(fetchModels());
    dispatch(fetchItems());
    dispatch(fetchUsers(""));
    dispatch(fetchSku(""));
  }, [dispatch]);

  return (
    <div className="w-screen h-screen overflow-hidden">
      <div className="flex h-full w-full">
        <Sidebar />
        <div className="flex-1 overflow-y-auto">
          <TopBar />
          <div className="px-5 py-5">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
