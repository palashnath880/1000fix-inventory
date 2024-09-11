import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import type { LoginInputs } from "../../types/reactHookForm.types";
import authApi from "../../api/auth";
import { AxiosError } from "axios";
import Cookies from "js-cookie";

export default function Login() {
  // states
  const [isShow, setIsShow] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  // react hook form
  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginInputs>();

  // login handler
  const loginHandler: SubmitHandler<LoginInputs> = async (data) => {
    try {
      setIsLoading(true);
      setErrorMsg("");
      const res = await authApi.login(data);
      if (res.data?.token) {
        const token = res.data?.token;
        Cookies.set("auth_token", token, { expires: 7 });
        reset();
        window.location.href = "/";
      }
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const msg =
        error?.response?.data?.message || "Sorry! Something went wrong";
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen grid place-items-center">
      <Paper className="!px-5 !py-5 sm:!w-[380px]">
        <form onSubmit={handleSubmit(loginHandler)}>
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
            {/* error message */}
            {errorMsg && (
              <Typography className="!text-center !text-red-500">
                {errorMsg}
              </Typography>
            )}

            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
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
