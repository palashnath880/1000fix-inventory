import React, { useEffect } from "react";
import Sidebar from "../components/shared/Sidebar";
import TopBar from "../components/shared/TopBar";
import { Alert, Paper, Typography } from "@mui/material";
import { AuthContext } from "../types/types";
import { useAppDispatch } from "../hooks";
import {
  fetchBranch,
  fetchCategories,
  fetchItems,
  fetchModels,
  fetchSku,
  fetchUOMs,
} from "../features/utilsSlice";
import { fetchUsers } from "../features/userSlice";
import authApi from "../api/auth";
export default function CSCLayout({
  children,
  context,
}: {
  children: React.ReactNode;
  context: AuthContext;
}) {
  const { user } = context;

  const dispatch = useAppDispatch();

  // fetch users
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchBranch(""));
    dispatch(fetchModels());
    dispatch(fetchItems());
    dispatch(fetchUsers(""));
    dispatch(fetchSku());
    dispatch(fetchUOMs());

    authApi.refresh().then((data) => console.log(data));
  }, [dispatch]);

  return (
    <div className="w-screen h-screen overflow-hidden">
      <div className="flex h-full w-full">
        <Sidebar />
        <div className="flex-1 overflow-y-auto">
          <TopBar />
          <div className="px-5 py-5">
            {!user?.branch ? (
              <div className="mt-5 flex justify-center">
                <Paper>
                  <Alert severity="warning">
                    <Typography variant="body1">
                      You are not selected for any branch, please contact admin.
                    </Typography>
                  </Alert>
                </Paper>
              </div>
            ) : (
              children
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
