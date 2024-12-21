/* eslint-disable @typescript-eslint/no-explicit-any */

import { Header } from "../../../components/shared/TopBar";
import { useAppSelector } from "../../../hooks";
import {
  Alert,
  Button,
  Checkbox,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { OwnStockType } from "../../../types/types";
import stockApi from "../../../api/stock";
import { Refresh } from "@mui/icons-material";
import { useState } from "react";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import scrapApi from "../../../api/scrap";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import SelectInput from "../../../components/stock/SelectInput";
import { SkuSelect } from "../../../components/shared/Inputs";
import { SkuTable } from "../../../components/shared/CustomTable";

type SelectType = { skuId: string; quantity: number; max: number };

const SelectItem = ({
  stock,
  values,
  onChange,
  disabled,
}: {
  stock: OwnStockType;
  values: SelectType[];
  onChange: (p1: SelectType[]) => void;
  disabled: boolean;
}) => {
  const checked = values.find((i) => i.skuId === stock.skuCode.id);
  const error =
    checked && (checked?.quantity < 1 || checked.quantity > checked.max);

  const onSelect = (checked: boolean, stock: OwnStockType) => {
    let state = [...values];

    if (checked) {
      state.push({
        skuId: stock.skuCode.id,
        max: stock.quantity,
        quantity: 1,
      });
    } else {
      state = state.filter((i) => i.skuId !== stock.skuCode.id);
    }
    onChange(state);
  };

  const changeHandler = (e: any) => {
    const quantity: number = parseInt(e.target.value);
    let state: SelectType[] = [...values];
    state = state.map((i) =>
      i.skuId === stock.skuCode.id ? { ...i, quantity } : i
    );
    onChange(state);
  };

  return (
    <span className="flex justify-end items-center gap-2">
      <TextField
        type="number"
        sx={{ width: 80 }}
        value={checked?.quantity || 0}
        onChange={changeHandler}
        onBlur={changeHandler}
        disabled={Boolean(!checked) || disabled}
        error={error}
      />
      <Checkbox
        checked={Boolean(checked) || disabled}
        onChange={(e) => onSelect(e.target.checked, stock)}
      />
    </span>
  );
};

function Defective() {
  // states
  const [selected, setSelected] = useState<SelectType[]>([]);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  // react redux
  const { data: categories } = useAppSelector(
    (state) => state.utils.categories
  );
  const { data: models } = useAppSelector((state) => state.utils.models);
  const { user } = useAppSelector((state) => state.auth);

  // search queries
  const { category, model, skuCode } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  // fetch stock
  const { data, isLoading, refetch, isSuccess } = useQuery<OwnStockType[]>({
    queryKey: ["defectiveStock", category, model, skuCode],
    queryFn: async () => {
      const res = await stockApi.getDefective(category, model, skuCode);
      return res.data;
    },
  });

  // defective send
  const defectiveHandler = async (type: "defective" | "scrap") => {
    const error = selected.some((i) => i.quantity < 1 || i.quantity > i.max);
    if (error) {
      toast.error(`Please select valid quantity`);
      return;
    }

    try {
      const list: any[] = selected.map((i) => ({
        skuCodeId: i.skuId,
        quantity: i.quantity,
      }));

      setIsDisabled(true);
      refetch();
      if (type === "defective") {
        await stockApi.sendDefective({ list });
        toast.success(`Defective send successfully`);
      } else if (type === "scrap") {
        await scrapApi.create({ items: list, from: "defective" });
        toast.success(`Moved to scrap done.`);
      }
      setSelected([]);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const msg =
        error.response?.data?.message || "Sorry! Something went wrong";
      toast.error(msg);
    } finally {
      setIsDisabled(false);
    }
  };

  // sum defective quantity
  const totalGood = Array.isArray(data)
    ? data?.reduce((total, val) => total + val.quantity, 0)
    : 0;

  return (
    <div className="pb-10">
      <Header title="Defective" />

      <div className="flex max-md:flex-col gap-3 flex-1">
        <SelectInput
          label="Select Category"
          loading={isLoading}
          options={categories}
          noOptionsText="No category matched"
          value={category}
          onChange={(val) =>
            navigate({ search: (prev) => ({ ...prev, category: val }) })
          }
        />

        <SelectInput
          label="Select Model"
          loading={isLoading}
          options={models}
          noOptionsText="No model matched"
          value={model}
          onChange={(val) =>
            navigate({ search: (prev) => ({ ...prev, model: val }) })
          }
        />

        <div className="flex-1">
          <SkuSelect
            disabled={isLoading}
            placeholder="Select SKU"
            value={skuCode}
            onChange={({ sku }) =>
              navigate({
                search: (prev) => ({ ...prev, skuCode: sku?.id || "" }),
              })
            }
          />
        </div>
      </div>

      {/* loader */}
      {isLoading && (
        <div className="mt-5">
          {[...Array(7)].map((_, index) => (
            <Skeleton key={index} height={70} />
          ))}
        </div>
      )}

      {/* data display */}
      {isSuccess && (
        <div className="mt-5">
          {Array.isArray(data) && data?.length > 0 ? (
            <TableContainer component={Paper}>
              <div className="px-4 py-3 flex items-center gap-4 justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    startIcon={<Refresh />}
                    variant="contained"
                    onClick={() => refetch()}
                  >
                    Refresh
                  </Button>
                </div>

                {selected?.length > 0 && (
                  <>
                    {user?.role === "admin" ? (
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => defectiveHandler("scrap")}
                        disabled={isDisabled}
                      >
                        Move to Scrap
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => defectiveHandler("defective")}
                        disabled={isDisabled}
                      >
                        Send To Head Office
                      </Button>
                    )}
                  </>
                )}
              </div>
              <Table id="defectiveStock">
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <SkuTable isHeader quantity />

                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <SkuTable
                        skuCode={item.skuCode}
                        quantity={item?.quantity || 0}
                      />
                      <TableCell>
                        <SelectItem
                          onChange={(e) => setSelected(e)}
                          values={selected}
                          stock={item}
                          disabled={isDisabled}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={6} className="!text-end">
                      <b>Total</b>
                    </TableCell>
                    <TableCell>{totalGood || 0}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Paper>
              <Alert severity="error">
                <Typography>No defective available</Typography>
              </Alert>
            </Paper>
          )}
        </div>
      )}
    </div>
  );
}

export const Route = createFileRoute("/csc/defective/")({
  component: Defective,
  validateSearch: (search) => {
    return {
      category: (search.category as string) || "",
      model: (search.model as string) || "",
      skuCode: (search.skuCode as string) || "",
    };
  },
});
