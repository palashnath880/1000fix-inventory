import { Button } from "@mui/material";
import Categories from "../../components/shared/Categories";
import Models from "../../components/shared/Models";

export default function SKUCode() {
  return (
    <>
      <div className="flex gap-4">
        <Categories />
        <Models />

        <Button variant="contained">Items</Button>
      </div>
      <h2>Hello sku code</h2>
    </>
  );
}
