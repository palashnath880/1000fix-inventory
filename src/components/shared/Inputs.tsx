import { Autocomplete, TextField } from "@mui/material";
import { useAppSelector } from "../../hooks";
import { SKUCode } from "../../types/types";

type SkuSelectProps = {
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
  value: string | SKUCode | null;
  onChange: (data: { sku: SKUCode | null }) => void;
  size?: "small" | "medium";
};

export const SkuSelect = ({
  placeholder,
  error,
  disabled,
  value,
  onChange,
  size,
}: SkuSelectProps) => {
  const { data: skuCodes } = useAppSelector((state) => state.utils.skuCodes);

  const input =
    typeof value === "string"
      ? skuCodes.find((i) => i.id === value) || null
      : value || null;

  return (
    <Autocomplete
      size={size || "medium"}
      disabled={disabled}
      options={skuCodes}
      value={input}
      noOptionsText="No sku matched"
      getOptionLabel={(opt) => opt.name}
      onChange={(_, val) => onChange({ sku: val })}
      filterOptions={(options, { inputValue }) => {
        const lowerCaseVal = inputValue.toLowerCase();
        return options.filter(
          (i) =>
            i.name.toLowerCase().includes(lowerCaseVal) ||
            i.item.name.toLowerCase().includes(lowerCaseVal)
        );
      }}
      isOptionEqualToValue={(opt, val) => opt.id === val.id}
      renderOption={(props, opt, state) => {
        return (
          <li
            {...props}
            key={state.index}
            className={`${props.className} flex-col !items-start`}
          >
            {opt.name}
            <small>
              Item: {opt.item?.name}; UOM: {opt.item?.uom}
            </small>
          </li>
        );
      }}
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
