import { Search } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { useEffect, useState } from "react";

type SearchInputProps = {
  placeholder: string;
  value: string | null;
  onSubmit: (val: string) => void;
};

export default function SearchInput({
  placeholder,
  value,
  onSubmit,
}: SearchInputProps) {
  // states
  const [input, setInput] = useState<string>("");

  useEffect(() => {
    if (typeof value === "string") setInput(value);
  }, [value]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(input);
      }}
      className="max-md:flex-1 max-md:w-full md:w-[350px]"
    >
      <div className="flex items-center">
        <TextField
          placeholder={placeholder}
          variant="outlined"
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton type="submit">
                    <Search />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </div>
    </form>
  );
}
