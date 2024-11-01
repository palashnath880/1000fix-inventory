/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Dialog,
  Divider,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { OwnStockType, SKUCode, User } from "../../types/types";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { JobItemInputs } from "../../types/reactHookForm.types";
import { Add, Close } from "@mui/icons-material";
import stockApi from "../../api/stock";
import { toast } from "react-toastify";
import { bindDialog } from "material-ui-popup-state";
import engineerStockApi from "../../api/engineerStock";
import { useMutation } from "@tanstack/react-query";
import { SkuSelect } from "../shared/Inputs";

type JobEntryItemProps = {
  popup: any;
  fields: {
    price: string;
    quantity: string;
    skuCodeId: string | undefined;
  }[];
  add: (data: {
    price: string;
    quantity: string;
    skuCode: SKUCode;
    skuCodeId: string;
  }) => void;
  engineer: User | null | any;
};

export default function JobEntryItem({
  popup,
  fields,
  add,
  engineer,
}: JobEntryItemProps) {
  // react hook form
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<JobItemInputs>();

  // stock by sku code
  const {
    data,
    isPending,
    mutate,
    reset: stockReset,
  } = useMutation<OwnStockType | null, any, string | undefined>({
    mutationFn: async (skuId) => {
      if (!skuId) return null;
      if (engineer) {
        const res = await engineerStockApi.stockBySku(engineer.id, skuId);
        return res.data;
      }

      const res = await stockApi.getBySkuId(skuId);
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.avgPrice) setValue("price", data.avgPrice.toString());
    },
    onError: () => toast.error(`Sorry! Something went wrong`),
  });

  // add item handler
  const addItem: SubmitHandler<JobItemInputs> = ({
    price,
    quantity,
    skuCode,
  }) => {
    if (!data) return;

    if (fields.find((i) => i.skuCodeId === skuCode?.id)) {
      toast.error(`This item already added`);
      return;
    }
    const stockQuantity: number =
      typeof data?.quantity === "string"
        ? parseFloat(data?.quantity)
        : data?.quantity;

    if (parseFloat(quantity) > stockQuantity) {
      toast.error("Invalid quantity");
      return;
    }

    const item: any = {
      price,
      quantity,
      skuCode,
      skuCodeId: skuCode?.id,
    };
    add(item);
    reset();
    setValue("skuCode", null);
    stockReset();
    popup?.close();
  };

  return (
    <Dialog {...bindDialog(popup)}>
      <Paper className="px-5 py-5 md:w-[450px]">
        <div className="flex justify-between items-center gap-3">
          <Typography variant="h6">Add New Job Item</Typography>
          <IconButton onClick={popup?.close}>
            <Close />
          </IconButton>
        </div>
        <Divider className="!my-3" />
        <form onSubmit={handleSubmit(addItem)}>
          <div className="flex flex-col gap-5">
            <Controller
              control={control}
              name="skuCode"
              rules={{ required: true }}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <SkuSelect
                  disabled={isPending}
                  error={Boolean(error)}
                  value={value}
                  onChange={({ sku }) => {
                    mutate(sku?.id);
                    onChange(sku);
                  }}
                />
              )}
            />

            {data && (
              <>
                <div className="flex flex-col gap-0">
                  <Typography variant="body2">
                    <span className="font-semibold">Item:</span>{" "}
                    {data?.skuCode?.item?.name}
                  </Typography>
                  <Typography variant="body2">
                    <span className="font-semibold">UOM:</span>{" "}
                    {data?.skuCode?.item?.uom}
                  </Typography>
                  <Typography variant="body2">
                    <span className="font-semibold">Price:</span>{" "}
                    {data?.avgPrice}
                  </Typography>
                  <Typography variant="body2">
                    <span className="font-semibold">Available Quantity:</span>{" "}
                    {data?.quantity}
                  </Typography>
                </div>
                <TextField
                  fullWidth
                  type="text"
                  label="Quantity"
                  placeholder="Quantity"
                  error={Boolean(errors["quantity"])}
                  {...register("quantity", {
                    required: true,
                    pattern: /^\d+(\.\d+)?$/,
                  })}
                />
              </>
            )}

            <Button
              type="submit"
              startIcon={<Add />}
              disabled={isPending || !data}
            >
              Add Item
            </Button>
          </div>
        </form>
      </Paper>
    </Dialog>
  );
}
