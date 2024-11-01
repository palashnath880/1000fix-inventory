/* eslint-disable @typescript-eslint/no-explicit-any */
import { Login } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { AxiosErr } from "../../types/types";
import { useState } from "react";
import { toast } from "react-toastify";
import authApi from "../../api/auth";

export const Route = createFileRoute("/__auth/forgot-password")({
  component: ForgotPWD,
});

function ForgotPWD() {
  // states
  const [val, setVal] = useState<string>("");

  // send reset link handler
  const { isError, isPending, error, mutate } = useMutation<
    any,
    AxiosErr,
    string
  >({
    mutationFn: (data) => authApi.sendLink(data),
    onSuccess: () => {
      toast.success(`Reset link sent successfully`);
      setVal("");
    },
  });
  const errorMsg =
    error?.response?.data.message || "Sorry! Something went wrong";

  return (
    <div className="w-screen h-screen grid place-items-center">
      <Paper className="!px-5 !py-5 max-sm:w-[90%] sm:!w-[380px]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutate(val);
          }}
        >
          <div className="flex flex-col gap-4">
            <Typography className="!text-center !font-bold" variant="h5">
              Forgot Password
            </Typography>

            <TextField
              fullWidth
              label="Email or Username"
              type="text"
              variant="outlined"
              value={val}
              onChange={(e) => setVal(e.target.value)}
            />

            <Typography
              variant="body2"
              component={Link}
              to="/login"
              className="!inline-flex gap-2 items-center !w-max"
            >
              <Login /> Back to Login
            </Typography>

            {/* error message */}
            {isError && (
              <Typography className="!text-center !text-red-500">
                {errorMsg}
              </Typography>
            )}

            <Button fullWidth type="submit" disabled={isPending || !val}>
              {isPending ? (
                <CircularProgress color="inherit" size={22} />
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </div>
        </form>
      </Paper>
    </div>
  );
}
