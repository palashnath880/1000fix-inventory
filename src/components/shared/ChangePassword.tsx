/* eslint-disable @typescript-eslint/no-explicit-any */
import { Check, Close, Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  Dialog,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { AxiosError } from "axios";
import PopupState, { bindDialog } from "material-ui-popup-state";
import React, { useState } from "react";
import { toast } from "react-toastify";
import authApi from "../../api/auth";

type PasswordState = { prev: string; new: string; confirm: string };
type ShowState = { prev: boolean; new: boolean; confirm: boolean };

const PassInput = ({
  isShow,
  onChange,
  value,
  setIsShow,
  placeholder,
}: {
  value: string;
  isShow: boolean;
  onChange: (p1: string) => void;
  setIsShow: (p1: boolean) => void;
  placeholder: string;
}) => {
  return (
    <TextField
      fullWidth
      placeholder={placeholder}
      type={isShow ? "text" : "password"}
      value={value}
      onChange={(e) => onChange(e.target.value)}
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
  );
};

export default function ChangePassword({
  children,
}: {
  children: (state: any) => React.ReactNode;
}) {
  // states
  const [password, setPassword] = useState<PasswordState>({
    prev: "",
    new: "",
    confirm: "",
  });
  const [isShow, setIsShow] = useState<ShowState>({
    prev: false,
    new: false,
    confirm: false,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  // password change handler
  const passwordHandler = async (close: () => void) => {
    try {
      setIsLoading(true);
      await authApi.changePwd({ prev: password.prev, new: password.new });
      toast.success(`Password changed successfully`);
      setPassword({ confirm: "", new: "", prev: "" });
      close();
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const msg =
        error?.response?.data?.message || "Sorry! Something went wrong";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PopupState variant="popover">
        {(popup) => (
          <>
            {children(popup)}
            <Dialog
              {...bindDialog(popup)}
              PaperProps={{
                className:
                  "!px-4 !py-4 sm:!w-[400px] max-sm:!mx-0 max-sm:!w-[95vw] ",
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <Typography variant="h6">Change Password</Typography>
                <IconButton onClick={popup.close}>
                  <Close />
                </IconButton>
              </div>
              <div className="flex flex-col gap-3 mt-5">
                <PassInput
                  placeholder="Previous Password"
                  isShow={isShow.prev}
                  value={password.prev}
                  onChange={(val) =>
                    setPassword((state) => ({
                      ...state,
                      prev: val,
                    }))
                  }
                  setIsShow={(val) =>
                    setIsShow((state) => ({
                      ...state,
                      prev: val,
                    }))
                  }
                />

                <PassInput
                  placeholder="New Password"
                  isShow={isShow.new}
                  value={password.new}
                  onChange={(val) =>
                    setPassword((state) => ({
                      ...state,
                      new: val,
                    }))
                  }
                  setIsShow={(val) =>
                    setIsShow((state) => ({
                      ...state,
                      new: val,
                    }))
                  }
                />

                <PassInput
                  placeholder="Confirm Password"
                  isShow={isShow.confirm}
                  value={password.confirm}
                  onChange={(val) =>
                    setPassword((state) => ({
                      ...state,
                      confirm: val,
                    }))
                  }
                  setIsShow={(val) =>
                    setIsShow((state) => ({
                      ...state,
                      confirm: val,
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

                <Button
                  variant="contained"
                  disabled={isValid || isLoading || !password.prev}
                  onClick={() => passwordHandler(popup.close)}
                >
                  Update Password
                </Button>
              </div>
            </Dialog>
          </>
        )}
      </PopupState>
    </>
  );
}
