/* eslint-disable @typescript-eslint/no-explicit-any */
import { Autocomplete, TextField } from "@mui/material";

type SelectInputProps = {
  loading: boolean;
  value: string;
  options: any[];
  label: string;
  noOptionsText: string;
  onChange: (val: string) => void;
};

export default function SelectInput({
  loading,
  label,
  options,
  value,
  noOptionsText,
  onChange,
}: SelectInputProps) {
  return (
    <Autocomplete
      disabled={loading}
      options={options}
      className="!flex-1"
      onChange={(_, val) => onChange(val?.id || "")}
      value={options?.find((i) => i?.id === value) || null}
      getOptionLabel={(opt) => opt?.name}
      isOptionEqualToValue={(opt, val) => opt?.id === val?.id}
      noOptionsText={noOptionsText}
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder={label} />
      )}
    />
  );
}
