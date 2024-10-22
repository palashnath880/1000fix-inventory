/* eslint-disable @typescript-eslint/no-explicit-any */
import { Add, Category as CategoryIcon, Close } from "@mui/icons-material";
import {
  Alert,
  AppBar,
  Button,
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
import { SubmitHandler, useForm } from "react-hook-form";
import type { CategoryInputs } from "../../types/reactHookForm.types";
import { useState } from "react";
import { AxiosError } from "axios";
import categoryApi from "../../api/category";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { fetchCategories } from "../../features/utilsSlice";
import moment from "moment";
import type { Category } from "../../types/types";
import DeleteConfirm from "../shared/DeleteConfirm";
import { useMutation } from "@tanstack/react-query";

export default function Categories() {
  // states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // dispatch
  const { data: categories, loading } = useAppSelector(
    (state) => state.utils.categories
  );
  const dispatch = useAppDispatch();

  // react hook form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryInputs>();

  // add handler
  const addHandler: SubmitHandler<CategoryInputs> = async (data) => {
    try {
      setIsLoading(true);
      setErrorMsg("");
      await categoryApi.create(data);
      reset();
      dispatch(fetchCategories());
      toast.success(`Category added successfully`);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const msg =
        error?.response?.data?.message || "Sorry! Something went wrong";
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // category delete handler
  const deleteCate = useMutation<any, any, Category, { id: number | string }>({
    mutationFn: (category) => categoryApi.delete(category.id),
    onMutate: (category) => {
      const toastId = toast.loading(`Deleting ${category.name}`);
      return { id: toastId };
    },
    onSuccess: (_, category, { id }) => {
      toast.update(id, {
        autoClose: 3000,
        type: "success",
        isLoading: false,
        render: `${category.name} deleted`,
      });
      dispatch(fetchCategories());
    },
    onError: (_, category, context) => {
      if (!context?.id) return;
      toast.update(context?.id, {
        autoClose: 3000,
        type: "error",
        isLoading: false,
        render: `Sorry! ${category.name} couldn't be deleted`,
      });
    },
  });

  return (
    <>
      <Button startIcon={<CategoryIcon />} onClick={() => setIsOpen(true)}>
        Categories
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
                Categories
              </Typography>
              <IconButton onClick={() => setIsOpen(false)}>
                <Close />
              </IconButton>
            </div>
          </AppBar>

          <div className="pt-4 px-4 flex flex-col flex-1 overflow-hidden gap-5">
            <form onSubmit={handleSubmit(addHandler)}>
              <div className="flex flex-col gap-4">
                <TextField
                  label="Category Name"
                  fullWidth
                  type="text"
                  placeholder="Category Name"
                  error={Boolean(errors["name"])}
                  {...register("name", { required: true })}
                />
                {errorMsg && (
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
                  startIcon={<Add />}
                  disabled={isLoading}
                >
                  Add Category
                </Button>
              </div>
            </form>

            {/* category list */}
            <div className="!overflow-y-auto flex-1 pb-10 overflow-hidden">
              {/* loader  */}
              {loading && (
                <div className="">
                  {[...Array(3)].map((_, index) => (
                    <Skeleton height={70} key={index} />
                  ))}
                </div>
              )}

              {/* display categories */}
              {!loading && (
                <>
                  {Array.isArray(categories) && categories.length > 0 ? (
                    <List>
                      {categories?.map((category, index) => (
                        <ListItem
                          key={category.id}
                          secondaryAction={
                            <DeleteConfirm
                              title={
                                <>
                                  Are you sure to delete <b>{category.name}</b>
                                </>
                              }
                              confirm={() => deleteCate.mutate(category)}
                            />
                          }
                          className="!py-0 !border-b !px-0"
                        >
                          <ListItemAvatar className="!min-w-[36px]">
                            {index + 1}
                          </ListItemAvatar>
                          <ListItemText
                            primary={category.name}
                            secondary={moment(category.createdAt).format("lll")}
                            secondaryTypographyProps={{ className: "!text-xs" }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Alert severity="error">
                      <Typography variant="body1">
                        No category available
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
