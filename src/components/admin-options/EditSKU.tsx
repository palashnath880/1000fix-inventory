/* eslint-disable @typescript-eslint/no-explicit-any */
import { Close, Edit } from "@mui/icons-material";
import {
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  IconButton,
  Modal,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { SKUInputs } from "../../types/reactHookForm.types";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { AxiosErr, SKUCode } from "../../types/types";
import { toast } from "react-toastify";
import skuCodeApi from "../../api/skuCode";

export default function EditSKU({
  refetch,
  skuCode,
}: {
  refetch: () => void;
  skuCode: SKUCode;
}) {
  // states
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // react hook form
  const {
    control,
    formState: { errors },
    register,
    reset,
    handleSubmit,
    setValue,
  } = useForm<SKUInputs>({});
  const { name, isDefective } = useWatch({ control });
  const isChanged =
    isDefective !== skuCode.isDefective || name !== skuCode.name;

  // update sku
  const update = useMutation<any, AxiosErr, SKUInputs>({
    mutationFn: (data) => skuCodeApi.update(skuCode.id, data),
    onSuccess: () => {
      toast.success(`SKU Updated`);
      refetch();
      reset();
    },
  });

  // close function
  const handleClose = () => {
    if (update.isPending) return;
    reset();
    setIsOpen(false);
  };

  // set data in the hook-form
  useEffect(() => {
    if (isOpen && skuCode) {
      setValue("name", skuCode.name);
      setValue("isDefective", skuCode.isDefective);
    }
  }, [skuCode, isOpen, setValue]);

  return (
    <>
      <Tooltip title="Edit SKU Code">
        <IconButton onClick={() => setIsOpen(true)}>
          <Edit color="primary" />
        </IconButton>
      </Tooltip>

      {/* edit modal */}
      <Modal
        open={isOpen}
        onClose={handleClose}
        className="grid place-items-center"
      >
        <div className="px-3 py-3 w-[450px] bg-white rounded-md">
          <div className="flex justify-between items-center">
            <Typography variant="body1">Edit SKU</Typography>
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </div>
          <form onSubmit={handleSubmit((val) => update.mutate(val))}>
            <div className="flex flex-col gap-3 mt-5">
              <TextField
                label="SKU Code"
                fullWidth
                type="text"
                placeholder="SKU Code"
                slotProps={{ htmlInput: { className: "!uppercase" } }}
                error={Boolean(errors["name"])}
                {...register("name", {
                  required: true,
                  pattern: /^[a-zA-Z0-9]+$/,
                })}
              />
              <Controller
                control={control}
                name="isDefective"
                render={({ field: { value, onChange } }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={value}
                        onChange={(e) => onChange(Boolean(e.target.checked))}
                      />
                    }
                    label="Generate Defective"
                  />
                )}
              />

              {/* error message */}
              {update.isError && (
                <Typography
                  variant="body2"
                  className="!text-center !text-red-400"
                >
                  {update.error.response?.data.message ||
                    "Sorry! Something went wrong"}
                </Typography>
              )}

              <Button
                fullWidth
                type="submit"
                startIcon={
                  update.isPending && (
                    <CircularProgress size={20} color="inherit" />
                  )
                }
                disabled={update.isPending || !isChanged}
              >
                Update SKU
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
