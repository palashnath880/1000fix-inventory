import { Outlet } from "react-router-dom";
import Sidebar from "../components/shared/Sidebar";

export default function LayoutProvider() {
  return (
    <div className="w-screen h-screen overflow-hidden">
      <div className="flex h-full w-full">
        <Sidebar />
        <div className="flex-1 px-4 py-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
