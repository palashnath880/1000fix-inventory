import { Outlet } from "react-router-dom";
import Sidebar from "../components/shared/Sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAppDispatch } from "../hooks";
import { fetchUsers } from "../features/userSlice";
import { fetchSku } from "../features/skuCodeSlice";
import { fetchCategories } from "../features/categorySlice";
import { fetchModels } from "../features/modelSlice";
import { fetchItems } from "../features/itemSlice";

const client = new QueryClient();

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
    <QueryClientProvider client={client}>
      <div className="w-screen h-screen overflow-hidden">
        <div className="flex h-full w-full">
          <Sidebar />
          <div className="flex-1 px-4 py-5 overflow-y-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
}
