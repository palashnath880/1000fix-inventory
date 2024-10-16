/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  IconButton,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useAppSelector } from "../../hooks";
import { Add, Close, LocalShipping } from "@mui/icons-material";
import { StockTransferInputs } from "../../types/reactHookForm.types";
import { useEffect, useState } from "react";
import { Branch, OwnStockType, User } from "../../types/types";
import { toast } from "react-toastify";
import stockApi from "../../api/stock";
import { AxiosError } from "axios";
import engineerStockApi from "../../api/engineerStock";
import { SkuSelect } from "../shared/Inputs";
import SelectInput from "./SelectInput";

export default function StockTransferForm() {
  // states
  const [ownStock, setOwnStock] = useState<OwnStockType | null>(null);
  const [stockLoading, setStockLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [transferList, setTransferList] = useState<StockTransferInputs[]>([]);
  const [stockToEn, setStockToEn] = useState<boolean>(false);
  const [engineer, setEngineer] = useState<User | null>(null);
  const [branch, setBranch] = useState<Branch | null>(null);

  // react redux
  const { data: branchesArr } = useAppSelector((state) => state.utils.branches);
  const { data: users } = useAppSelector((state) => state.users);
  const { user } = useAppSelector((state) => state.auth);
  const branches = branchesArr.filter((i) => i.id !== user?.branch?.id);
  const engineers = users.filter((i) => i.role === "engineer");

  // react hook form
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<StockTransferInputs>({ defaultValues: { stockToEn: false } });

  // add to transfer list
  const addToList: SubmitHandler<StockTransferInputs> = (data) => {
    console.log(data);

    if (!ownStock) return;
    if (ownStock?.quantity < parseFloat(data?.quantity)) {
      toast.error(`Invalid quantity`);
      return;
    }
    if (stockToEn) data.engineer = engineer;
    if (!stockToEn) data.branch = branch;
    const list: StockTransferInputs[] = [
      ...transferList,
      { ...data, stockToEn },
    ];

    setTransferList(list);
    setOwnStock(null);
    setValue("skuCode", null);
    reset();
  };

  // remove form the transfer list
  const remove = (index: number) => {
    const list = [...transferList];
    list.splice(index, 1);
    setTransferList(list);
  };

  // fetch stock by sku id
  const stockBySkuId = async (skuId: string | undefined) => {
    if (!skuId) {
      setOwnStock(null);
      return;
    }
    try {
      setStockLoading(true);
      const res = await stockApi.getBySkuId(skuId || "");
      if (res?.data && typeof res?.data === "object") {
        const stock: OwnStockType = res?.data;
        const filteredList = transferList.filter(
          (i) => i.skuCode?.id === skuId
        );
        const totalQuantity = filteredList.reduce(
          (total, list) => total + parseFloat(list.quantity),
          0
        );
        stock.quantity = stock.quantity - totalQuantity;
        setOwnStock(stock);
      }
    } catch (err) {
      console.error(err);
      toast.error(`Sorry! Something went wrong.`);
    } finally {
      setStockLoading(false);
    }
  };

  // transfer handler
  const transferHandler = async () => {
    try {
      setSubmitting(true);

      // engineer stock
      const engineerList = transferList
        .filter((i) => i.stockToEn)
        .map((i) => {
          const obj: {
            skuCodeId: string;
            quantity: number;
            engineerId: string;
          } = {
            engineerId: i.engineer?.id || "",
            quantity: parseFloat(i.quantity),
            skuCodeId: i.skuCode?.id || "",
          };
          return obj;
        });

      const branchList = transferList
        .filter((i) => !i.stockToEn)
        .map((i) => {
          const obj: {
            skuCodeId: string;
            quantity: number;
            receiverId: string;
          } = {
            receiverId: i.branch?.id || "",
            quantity: parseFloat(i.quantity),
            skuCodeId: i.skuCode?.id || "",
          };
          return obj;
        });

      await stockApi.transfer({ list: branchList });
      await engineerStockApi.transfer({ list: engineerList });
      setTransferList([]);
      toast.success(`Stock transferred.`);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const msg =
        error?.response?.data?.message || "Sorry! Something went wrong";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // when stockToEn state is changed
  useEffect(() => {
    setEngineer(null);
    setBranch(null);
    reset();
  }, [stockToEn]);

  return (
    <div className="flex items-start gap-5">
      {/* stock add form */}
      <Paper elevation={3} className="px-5 py-5 !bg-slate-50 flex-1">
        <Typography variant="h6">Stock Transfer Form</Typography>
        <Divider className="!my-2" />
        <form onSubmit={handleSubmit(addToList)}>
          <div className="flex flex-col gap-4 pt-3">
            {/* stock transfer to engineer checkbox */}
            <FormControlLabel
              className="!w-max"
              checked={stockToEn}
              control={
                <Checkbox onChange={(e) => setStockToEn(e.target.checked)} />
              }
              label="Transfer to engineer"
            />

            {/* select receiver */}
            {stockToEn ? (
              <SelectInput
                loading={false}
                options={engineers}
                label="Select Engineer"
                noOptionsText="No engineer matched"
                value={engineer?.id || ""}
                onChange={(val) =>
                  setEngineer(engineers.find((i) => i.id === val) || null)
                }
              />
            ) : (
              <SelectInput
                loading={false}
                options={branches}
                label="Select Branch"
                noOptionsText="No branch matched"
                value={branch?.id || ""}
                onChange={(val) =>
                  setBranch(branches.find((i) => i.id === val) || null)
                }
              />
            )}

            {(engineer || branch) && (
              <>
                {/* sku code selector */}
                <Controller
                  control={control}
                  name="skuCode"
                  rules={{ required: true }}
                  render={({
                    field: { value, onChange },
                    fieldState: { error },
                  }) => (
                    <SkuSelect
                      error={Boolean(error)}
                      value={value}
                      disabled={stockLoading}
                      onChange={({ sku }) => {
                        onChange(sku);
                        stockBySkuId(sku?.id);
                      }}
                    />
                  )}
                />
                <Typography>
                  <b>Available Quantity:</b> {ownStock?.quantity || 0}
                </Typography>
                <Typography>
                  <b>Average Price:</b> {ownStock?.avgPrice || 0}
                </Typography>
                <TextField
                  fullWidth
                  type="text"
                  label="Quantity"
                  placeholder="Quantity"
                  error={Boolean(errors["quantity"])}
                  {...register("quantity", {
                    required: true,
                    pattern: /^\d+(\.\d+)?$/,
                    min: 1,
                  })}
                />

                <Button variant="contained" startIcon={<Add />} type="submit">
                  Add To Transfer List
                </Button>
              </>
            )}
          </div>
        </form>
      </Paper>

      {/* stock transfer list */}
      <Paper className="px-5 py-5 !bg-slate-50 flex-1" elevation={3}>
        <Typography variant="h6">Stock Transfer List</Typography>
        <Divider className="!my-2" />
        <div className="pt-3 flex flex-col gap-3">
          {transferList?.map((list, index) => (
            <Paper key={index} className="!p-4 flex items-center">
              <div className="flex flex-col flex-1">
                <p className="!text-sm flex gap-2">
                  <b className="w-20">
                    {list.stockToEn ? "Engineer" : "Branch"}
                  </b>
                  <span className="flex-1">
                    : {list.stockToEn ? list.engineer?.name : list.branch?.name}
                  </span>
                </p>
                <p className="!text-sm flex gap-2">
                  <b className="w-20">SKU Code</b>
                  <span className="flex-1">: {list.skuCode?.name}</span>
                </p>
                <p className="!text-sm flex gap-2">
                  <b className="w-20">Quantity</b>
                  <span className="flex-1">: {list.quantity}</span>
                </p>
              </div>
              <Tooltip title="Remove from the transfer list">
                <IconButton color="error" onClick={() => remove(index)}>
                  <Close />
                </IconButton>
              </Tooltip>
            </Paper>
          ))}

          <Button
            variant="contained"
            startIcon={
              !submitting ? (
                <LocalShipping />
              ) : (
                <CircularProgress size={22} color="inherit" />
              )
            }
            disabled={transferList?.length <= 0 || submitting}
            onClick={transferHandler}
          >
            Transfer Stock
          </Button>
        </div>
      </Paper>
    </div>
  );
}
