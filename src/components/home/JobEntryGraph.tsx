import { ArrowDropDown } from "@mui/icons-material";
import { Button, Menu, MenuItem, Paper, Typography } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { useQuery } from "@tanstack/react-query";
import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state";
import { useEffect, useState } from "react";
import jobApi from "../../api/job";

export default function JobEntryGraph() {
  // states
  const [month, setMonth] = useState<string>("");
  const [monthDays, setMonthDays] = useState<number>(0);
  const months: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const daysArr = [...Array(monthDays)].map((_, index) => index + 1);

  // react - query
  const { data, isLoading } = useQuery({
    queryKey: ["jobEntryGraph", month],
    queryFn: async () => {
      if (!month) return {};
      const monthIndex = months.indexOf(month);
      const res = await jobApi.graph(monthIndex + 1);
      return res.data;
    },
  });
  const dataArr =
    daysArr && data ? daysArr.map((_, index) => data[index + 1] || 0) : [];

  // set current month
  useEffect(() => {
    const today = new Date();
    const monthIndex = today.getMonth();
    const currentYear = today.getFullYear();
    const daysInCuMonth = new Date(currentYear, monthIndex + 1, 0).getDate();
    setMonthDays(daysInCuMonth);
    setMonth(months[monthIndex]);
  }, []);

  return (
    <Paper elevation={3}>
      <div className="flex justify-between items-start pt-4 px-4">
        <Typography className="!text-base !font-semibold">
          Total job entry in <b>{month}</b>
        </Typography>
        <PopupState variant="popover">
          {(popup) => (
            <>
              <Button
                variant="outlined"
                endIcon={<ArrowDropDown />}
                className="!text-sm !w-[130px]"
                {...bindTrigger(popup)}
              >
                {month}
              </Button>
              <Menu
                {...bindMenu(popup)}
                MenuListProps={{ className: "!w-[130px]" }}
              >
                {months.map((item, index) => (
                  <MenuItem
                    onClick={() => {
                      setMonth(item);
                      popup.close();
                    }}
                    key={index}
                  >
                    {item}
                  </MenuItem>
                ))}
              </Menu>
            </>
          )}
        </PopupState>
      </div>
      <div className="aspect-[16/8] lg:aspect-[16/5]">
        <LineChart
          xAxis={[
            {
              data: daysArr,
              max: 31,
              min: 1,
              scaleType: "point",
              hideTooltip: true,
            },
          ]}
          series={[
            {
              data: dataArr,
              area: true,
              color: "#7CC674",
            },
          ]}
          loading={isLoading}
        />
      </div>
    </Paper>
  );
}
