/* eslint-disable @typescript-eslint/no-explicit-any */
import { Add, Close } from "@mui/icons-material";
import {
  Alert,
  AppBar,
  Autocomplete,
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

import { Controller, useForm } from "react-hook-form";
import type { ModelInputs } from "../../types/reactHookForm.types";
import { useState } from "react";
import modelApi from "../../api/model";
import { useAppDispatch, useAppSelector } from "../../hooks";
import moment from "moment";
import { fetchModels } from "../../features/utilsSlice";
import { toast } from "react-toastify";
import { AxiosErr, Model } from "../../types/types";
import DeleteConfirm from "../shared/DeleteConfirm";
import { useMutation } from "@tanstack/react-query";

export default function Models() {
  // states
  const [isOpen, setIsOpen] = useState<boolean>(false);

  //  react redux
  const { data: models, loading } = useAppSelector(
    (state) => state.utils.models
  );
  const { data: categories } = useAppSelector(
    (state) => state.utils.categories
  );
  const dispatch = useAppDispatch();

  // react hook form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
    setValue,
  } = useForm<ModelInputs>();

  // add model handler
  const add = useMutation<any, AxiosErr, ModelInputs>({
    mutationFn: (data) => {
      return modelApi.create({
        name: data.name,
        categoryId: data.category?.id || "",
      });
    },
    onSuccess: (_, data) => {
      toast.success(`${data.name} added successfully`);
      reset();
      setValue("category", null);
      dispatch(fetchModels());
    },
  });
  // add error message
  const errorMsg: string =
    add.error?.response?.data.message || "Sorry! Something went wrong";

  // model delete handler
  const dltModel = useMutation<any, AxiosErr, Model>({
    mutationFn: ({ id }) => modelApi.delete(id),
    onSuccess: (_, { name }) => {
      toast.success(`${name} deleted`);
      dispatch(fetchModels());
    },
    onError: (_, { name }) => {
      toast.error(`Sorry! ${name} couldn't be deleted`);
    },
  });

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Models</Button>

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
                Models
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
                  label="Model Name"
                  fullWidth
                  type="text"
                  placeholder="Model Name"
                  error={Boolean(errors["name"])}
                  {...register("name", { required: true })}
                />

                <Controller
                  control={control}
                  name="category"
                  rules={{ required: true }}
                  render={({
                    fieldState: { error },
                    field: { value, onChange },
                  }) => (
                    <Autocomplete
                      options={categories}
                      value={value || null}
                      onChange={(_, val) => onChange(val)}
                      getOptionLabel={(option) => option.name}
                      isOptionEqualToValue={(a, b) => a.id === b.id}
                      noOptionsText="No categories matched"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Category"
                          placeholder="Select Category"
                          error={Boolean(error)}
                        />
                      )}
                    />
                  )}
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
                  {!add.isPending && "Add Model"}
                </Button>
              </div>
            </form>

            {/* model list */}
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
                  {Array.isArray(models) && models.length > 0 ? (
                    <List>
                      {models?.map((model, index) => (
                        <ListItem
                          key={model.id}
                          secondaryAction={
                            <DeleteConfirm
                              title={
                                <>
                                  Are you sure to delete <b>{model.name}</b>
                                </>
                              }
                              confirm={() => dltModel.mutate(model)}
                            />
                          }
                          className="!py-0 !border-b !px-0"
                        >
                          <ListItemAvatar className="!min-w-[36px]">
                            {index + 1}
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <>
                                {model.name}
                                <small className="ml-2">
                                  {moment(model.createdAt).format("lll")}
                                </small>
                              </>
                            }
                            secondary={<>Category: {model.category.name}</>}
                            secondaryTypographyProps={{ className: "!text-xs" }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Alert severity="error">
                      <Typography variant="body1">
                        No model available
                      </Typography>
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
