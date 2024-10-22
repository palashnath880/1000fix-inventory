/* eslint-disable @typescript-eslint/no-explicit-any */
import { Add, Close, PlaylistAdd } from "@mui/icons-material";
import {
  Alert,
  AppBar,
  Button,
  CircularProgress,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";

import { useForm } from "react-hook-form";
import { AxiosError } from "axios";
import { useAppDispatch, useAppSelector } from "../../hooks";
import moment from "moment";
import { toast } from "react-toastify";
import { UOM } from "../../types/types";
import DeleteConfirm from "../shared/DeleteConfirm";
import { useMutation } from "@tanstack/react-query";
import uomApi from "../../api/uom";
import { fetchUOMs } from "../../features/utilsSlice";
import { useState } from "react";

type Inputs = {
  name: string;
};

type Error = AxiosError<{ message: string }>;

export default function UOMs() {
  // states
  const [isOpen, setIsOpen] = useState<boolean>(false);

  //  react redux
  const { data: uoms, loading } = useAppSelector((state) => state.utils.uoms);
  const dispatch = useAppDispatch();

  // react hook form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  // add mutation
  const add = useMutation<any, Error, Inputs>({
    mutationFn: (data) => uomApi.create(data),
    onSuccess: () => {
      reset();
      dispatch(fetchUOMs());
      toast.success(`UOM added successfully`);
    },
  });

  // add error message
  const errorMsg: string =
    add.error?.response?.data.message || "Sorry! Something went wrong";

  // delete mutation
  const deleteUOM = useMutation<any, Error, UOM, { id: string | number }>({
    mutationFn: (uom) => uomApi.delete(uom.id),
    onMutate: (uom) => {
      const id = toast.loading(`Deleting ${uom.name}`);
      return { id };
    },
    onSuccess: (_, uom, { id: toastId }) => {
      toast.update(toastId, {
        autoClose: 3000,
        type: "success",
        isLoading: false,
        render: `${uom.name} deleted`,
      });
      dispatch(fetchUOMs());
    },
    onError: (_, uom, context) => {
      if (context?.id)
        toast.update(context?.id, {
          autoClose: 3000,
          type: "error",
          isLoading: false,
          render: `Sorry! ${uom.name} couldn't be deleted`,
        });
    },
  });

  return (
    <>
      <Button startIcon={<PlaylistAdd />} onClick={() => setIsOpen(true)}>
        UOM
      </Button>

      <Drawer
        open={isOpen}
        anchor="right"
        onClose={() => setIsOpen(false)}
        PaperProps={{ className: `!w-[450px]` }}
      >
        <div className="flex flex-col overflow-hidden">
          <AppBar position="static" color="secondary">
            <div className="flex justify-between gap-5 items-center px-4 py-2">
              <Typography variant="h6" className="!font-semibold">
                UOMs
              </Typography>
              <IconButton onClick={() => setIsOpen(false)}>
                <Close />
              </IconButton>
            </div>
          </AppBar>

          <div className="pt-4 px-4 flex flex-col flex-1 overflow-hidden gap-5">
            {/* uom add form */}
            <form onSubmit={handleSubmit((data) => add.mutate(data))}>
              <div className="flex flex-col gap-4">
                <TextField
                  label="UOM Name"
                  fullWidth
                  type="text"
                  placeholder="UOM Name"
                  error={Boolean(errors["name"])}
                  {...register("name", { required: true })}
                />

                {/* error message show */}
                {add.isError && (
                  <Typography
                    variant="body2"
                    className="!text-center !text-red-400"
                  >
                    {errorMsg}
                  </Typography>
                )}
                <Button
                  fullWidth
                  type="submit"
                  startIcon={
                    !add.isPending ? (
                      <Add />
                    ) : (
                      <CircularProgress size={20} color="inherit" />
                    )
                  }
                  disabled={add.isPending}
                >
                  {!add.isPending && "Add UOM"}
                </Button>
              </div>
            </form>

            {/* uom list */}
            <div className="!overflow-y-auto flex-1 pb-10 overflow-hidden">
              {/* loader  */}
              {loading && (
                <div className="">
                  {[...Array(3)].map((_, index) => (
                    <Skeleton height={70} key={index} />
                  ))}
                </div>
              )}
              {/* display uom */}
              {!loading && (
                <>
                  {Array.isArray(uoms) && uoms.length > 0 ? (
                    <List>
                      {uoms?.map((uom, index) => (
                        <ListItem
                          key={uom.id}
                          secondaryAction={
                            <DeleteConfirm
                              title={
                                <>
                                  Are you sure to delete <b>{uom.name}</b>
                                </>
                              }
                              confirm={() => deleteUOM.mutate(uom)}
                            />
                          }
                          className="!py-0 !border-b !px-0"
                        >
                          <ListItemAvatar className="!min-w-[36px]">
                            {index + 1}
                          </ListItemAvatar>
                          <ListItemText
                            primary={uom.name}
                            secondary={moment(uom.createdAt).format("lll")}
                            secondaryTypographyProps={{ className: "!text-xs" }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Alert severity="error">
                      <Typography variant="body1">No uom available</Typography>
                    </Alert>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
}
