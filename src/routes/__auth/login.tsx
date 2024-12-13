/* eslint-disable @typescript-eslint/no-explicit-any */
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { LoginInputs } from "../../types/reactHookForm.types";
import authApi from "../../api/auth";
import { AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { AxiosErr } from "../../types/types";
import { toast } from "react-toastify";

export const Route = createFileRoute("/__auth/login")({
  component: Login,
});

function Login() {
  // states
  const [isShow, setIsShow] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);

  // react hook form
  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginInputs>();

  // login handler
  const { error, isError, isPending, mutate } = useMutation<
    AxiosResponse,
    AxiosErr,
    LoginInputs
  >({
    mutationFn: (data) => authApi.login(data),
    onSuccess: ({ data }) => {
      if (data) {
        Cookies.set("ac_token", data.ac_token, {
          expires: 7,
        });
        Cookies.set("re_token", data.re_token, {
          expires: 7,
          sameSite: "Strict",
          secure: true,
          path: "/",
        });
        reset();
        window.location.href = "/";
      } else {
        toast.error("Sorry! Something went wrong");
      }
    },
  });
  const errorMsg =
    error?.response?.data.message || "Sorry! Something went wrong";

  return (
    <div className="w-full h-screen grid place-items-center">
      <Paper className="!px-5 !py-5 max-sm:w-[90%] sm:!w-[380px]">
        <form onSubmit={handleSubmit((data) => mutate(data))}>
          <div className="flex flex-col gap-4">
            <Typography className="!text-center !font-bold" variant="h4">
              Login
            </Typography>

            <TextField
              fullWidth
              label="Email or Username"
              type="text"
              variant="outlined"
              error={Boolean(errors["login"])}
              {...register("login", { required: true })}
            />

            <TextField
              fullWidth
              label="Password"
              type={isShow ? "text" : "password"}
              variant="outlined"
              error={Boolean(errors["password"])}
              {...register("password", { required: true })}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setIsShow(!isShow)}>
                        {isShow ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <div className="flex justify-between items-center">
              <FormControlLabel
                label="Remember me"
                checked={isChecked}
                control={
                  <Checkbox onChange={(e) => setIsChecked(e.target.checked)} />
                }
              />
              <Typography
                variant="body2"
                component={Link}
                to="/forgot-password"
                className="underline hover:no-underline"
              >
                Forgot Password?
              </Typography>
            </div>

            {/* error message */}
            {isError && (
              <Typography className="!text-center !text-red-500">
                {errorMsg}
              </Typography>
            )}

            <Button fullWidth type="submit" disabled={isPending}>
              {isPending ? (
                <CircularProgress color="inherit" size={22} />
              ) : (
                "Login"
              )}
            </Button>
          </div>
        </form>
      </Paper>
    </div>
  );
}
