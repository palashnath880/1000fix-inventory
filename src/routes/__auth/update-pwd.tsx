/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AxiosErr } from "../../types/types";
import authApi from "../../api/auth";
import { toast } from "react-toastify";
import { Check } from "@mui/icons-material";

export const Route = createFileRoute("/__auth/update-pwd")({
  component: UpdatePwd,
  validateSearch: (search) => {
    return {
      tokenId: (search.tokenId as string) || "",
    };
  },
});

function UpdatePwd() {
  const { tokenId } = Route.useSearch();
  const navigate = useNavigate({ from: "/update-pwd" });

  // states
  const [password, setPassword] = useState<{ new: string; confirm: string }>({
    new: "",
    confirm: "",
  });
  const validation = [
    {
      pattern: !!(password.new.length >= 6),
      text: "At least 6 character",
    },
    {
      pattern: !!/(?=.*[a-z])/.test(password.new),
      text: "At least one lowercase letter",
    },
    {
      pattern: !!/(?=.*[A-Z])/.test(password.new),
      text: "At least one uppercase letter",
    },
    {
      pattern: !!/(?=.*\d)/.test(password.new),
      text: "At least one number",
    },
    {
      pattern: !!/(?=.*[@$!%*?&])/.test(password.new),
      text: "At least one special character",
    },
    {
      pattern:
        !!password.new && password.confirm && password.new === password.confirm,
      text: "Matched new and confirm password",
    },
  ];
  const isValid = !!validation.find((i) => !i.pattern);

  // update password
  const { isError, isPending, error, mutate } = useMutation<
    any,
    AxiosErr,
    { password: string; tokenId: string }
  >({
    mutationFn: (data) => authApi.updateResetPwd(data),
    onSuccess: () => {
      setPassword({ confirm: "", new: "" });
      toast.success(`Password reset successfully.`);
      navigate({ to: "/login" });
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
            mutate({ password: password.new, tokenId });
          }}
        >
          <div className="flex flex-col gap-4">
            <Typography className="!text-center !font-bold" variant="h5">
              Update Password
            </Typography>

            <TextField
              fullWidth
              placeholder="New Password"
              type="text"
              value={password.new}
              onChange={(e) =>
                setPassword((state) => ({
                  ...state,
                  new: e.target.value,
                }))
              }
            />
            <TextField
              fullWidth
              placeholder="Confirm New Password"
              value={password.confirm}
              onChange={(e) =>
                setPassword((state) => ({
                  ...state,
                  confirm: e.target.value,
                }))
              }
            />

            <div>
              {validation.map((item, index) => (
                <Typography key={index} variant="body2">
                  <Check
                    fontSize="small"
                    color={item?.pattern ? "success" : "primary"}
                  />{" "}
                  {item.text}
                </Typography>
              ))}
            </div>

            {/* error message */}
            {isError && (
              <Typography className="!text-center !text-red-500">
                {errorMsg}
              </Typography>
            )}

            <Button fullWidth type="submit" disabled={isPending || isValid}>
              {isPending ? (
                <CircularProgress color="inherit" size={22} />
              ) : (
                "Update Password"
              )}
            </Button>
          </div>
        </form>
      </Paper>
    </div>
  );
}
