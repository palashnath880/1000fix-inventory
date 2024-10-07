import { Autocomplete, TextField } from "@mui/material";
import { useAppSelector } from "../../hooks";
import { SKUCode } from "../../types/types";

type SkuSelectProps = {
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
  value: string | SKUCode | null;
  onChange: (data: { sku: SKUCode | null }) => void;
};

export const SkuSelect = ({
  placeholder,
  error,
  disabled,
  value,
  onChange,
}: SkuSelectProps) => {
  const { data: skuCodes } = useAppSelector((state) => state.skuCodes);

  const input =
    typeof value === "string"
      ? skuCodes.find((i) => i.id === value) || null
      : value || null;

  return (
    <Autocomplete
      disabled={disabled}
      options={skuCodes}
      value={input}
      noOptionsText="No sku matched"
      getOptionLabel={(opt) => opt.name}
      onChange={(_, val) => onChange({ sku: val })}
      isOptionEqualToValue={(opt, val) => opt.id === val.id}
      renderOption={(props, opt) => (
        <li
          {...props}
          key={opt.id}
          className={`${props.className} flex-col !items-start`}
        >
          {opt.name}
          <small>
            Item: {opt.item?.name}; UOM: {opt.item?.uom}
          </small>
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={placeholder || "Select sku code"}
          placeholder={placeholder || "Select sku code"}
          error={error}
        />
      )}
    />
  );
};
