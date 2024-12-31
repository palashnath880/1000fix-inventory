import SelectInput from "../stock/SelectInput";
import { useAppSelector } from "../../hooks";
import { useRouter } from "@tanstack/react-router";
import React from "react";
import { SkuSelect } from "./Inputs";

export default function FilterOptions({
  disabled,
  startContent,
}: {
  startContent?: React.ReactNode;
  disabled: boolean;
}) {
  // react-redux
  const { data: categories } = useAppSelector(
    (state) => state.utils.categories
  );
  const { data: models } = useAppSelector((state) => state.utils.models);

  // search queries
  const router = useRouter();
  const search = router.state.location.search;
  const { category, skuCode, model } = search;

  const navigate = (key: "skuCode" | "model" | "category", val: string) => {
    search[key] = val;
    router.navigate({
      to: router.state.location.pathname,
      search: search,
    });
  };

  return (
    <div className="flex max-md:flex-col gap-3 flex-1 items-center">
      {startContent && startContent}
      <SelectInput
        label="Select Category"
        loading={disabled}
        options={categories}
        noOptionsText="No category matched"
        value={category || ""}
        onChange={(val) => navigate("category", val)}
      />

      <SelectInput
        label="Select Model"
        loading={disabled}
        options={models}
        noOptionsText="No model matched"
        value={model || ""}
        onChange={(val) => navigate("model", val)}
      />
      <div className="flex-1">
        <SkuSelect
          value={skuCode || ""}
          onChange={({ sku }) => navigate("skuCode", sku?.id || "")}
        />
      </div>
    </div>
  );
}
