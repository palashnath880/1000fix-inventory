import { Search } from "@mui/icons-material";
import { Button } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment, { Moment } from "moment";
import React, { FormEvent, useEffect, useState } from "react";

type ReportDateInputsProps = {
  value: { from: string; to: string };
  isLoading?: boolean;
  onSearch: (value: { from: string; to: string }) => void;
  button?: React.ReactNode;
};

export default function ReportDateInputs({
  value,
  isLoading,
  button,
  onSearch,
}: ReportDateInputsProps) {
  // states
  const [fromDate, setFromDate] = useState<Moment | null>(null);
  const [toDate, setToDate] = useState<Moment | null>(null);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch({
      from: fromDate ? moment(fromDate).format("YYYY-MM-DD") : "",
      to: toDate ? moment(toDate).format("YYYY-MM-DD") : "",
    });
  };

  // set initial dates
  useEffect(() => {
    if (value) {
      if (value?.to) setToDate(moment(new Date(value.to)));
      if (value?.from) setFromDate(moment(new Date(value.from)));
    }
  }, [value]);

  return (
    <form onSubmit={handleSearch}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <div className="flex max-sm:flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <DatePicker
              label="From Date"
              value={fromDate}
              onChange={(e) => setFromDate(e)}
              sx={{ width: 200 }}
            />
            <DatePicker
              label="To Date"
              value={toDate}
              onChange={(e) => setToDate(e)}
              sx={{ width: 200 }}
            />
          </div>
          {button ? (
            <>{button}</>
          ) : (
            <Button
              type="submit"
              disabled={isLoading}
              variant="contained"
              startIcon={<Search />}
            >
              Search
            </Button>
          )}
        </div>
      </LocalizationProvider>
    </form>
  );
}
