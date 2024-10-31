/* eslint-disable prefer-const */

import moment from "moment";
import { utils, writeFile } from "xlsx";
import { AuthContext } from "../types/types";
import { toast } from "react-toastify";
import { redirect } from "@tanstack/react-router";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const getFileRoutes = () => {
  const files = import.meta.glob("../routes/manager/**/*.tsx", {
    eager: true,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const routes: { path: string; element: React.ReactNode }[] = [];
  const keys = Object.keys(files);

  // run loop on keys array
  for (const key of keys) {
    const keyArr = key.split("../routes/manager/");
    const path = keyArr[1].split(".tsx")[0];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const component: any = files[key];
    routes.push({ path, element: component?.default() });
  }

  return { admin: routes };
};

export const isArraysMatched = (arr1: any[], arr2: any[]) => {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
    return false;
  }
  return (
    arr1.every((item) => arr2.includes(item)) &&
    arr2.every((item) => arr1.includes(item))
  );
};

export const debounce = (func: any, delay: number = 300) => {
  let timer: any;

  return (...args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export const exportExcel = (tableId: string, filename: string = "report") => {
  const today = moment(new Date()).format("YYYY-MM-DD");
  filename = `${filename}-${today}.xls`;
  const headerRow = [];
  let data: any = [];

  const selectedTbl = document.getElementById(tableId);
  const tbHeader = selectedTbl?.querySelectorAll("thead tr th");
  const tbBody = selectedTbl?.querySelectorAll("tbody tr");

  // get the inner text of table header
  if (tbHeader) {
    for (let item of tbHeader) {
      const content = item.textContent;
      headerRow.push(content);
    }
  }

  if (tbBody) {
    for (let row of tbBody) {
      const columns = row.querySelectorAll("td");
      const columnData = [];
      for (let column of columns) {
        const content = column.textContent;
        const colspan = column.getAttribute("colspan");

        columnData.push(content);
        if (colspan && parseInt(colspan) > 0) {
          [...Array(parseInt(colspan) - 1)].map(() => columnData.push(""));
        }
      }
      data.push(columnData);
    }
  }

  data = [headerRow, ...data];

  const ws = utils.json_to_sheet(data, { skipHeader: true });
  const wb = utils.book_new();

  utils.sheet_add_aoa(ws, [headerRow], { origin: "A1" });
  utils.book_append_sheet(wb, ws, "Data");

  ws["!cols"] = [{ width: 10 }];

  /* export to XLSX */
  writeFile(wb, filename);
};

export const verifyAdmin = ({ auth: { user } }: { auth: AuthContext }) => {
  if (user?.role !== "admin") {
    toast.warn(`You have no permission to access this page.`);
    return redirect({ to: "/csc" });
  }
};
