import { Outlet } from "react-router-dom";
import Sidebar from "../components/shared/Sidebar";

import { useEffect } from "react";
import { useAppDispatch } from "../hooks";
import { fetchUsers } from "../features/userSlice";
import { fetchSku } from "../features/skuCodeSlice";
import { fetchCategories } from "../features/categorySlice";
import { fetchModels } from "../features/modelSlice";
import { fetchItems } from "../features/itemSlice";
import TopBar from "../components/shared/TopBar";

export default function LayoutProvider() {
  const dispatch = useAppDispatch();

  // fetch users
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchModels());
    dispatch(fetchItems());
    dispatch(fetchUsers(""));
    dispatch(fetchSku(""));
  }, []);
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
