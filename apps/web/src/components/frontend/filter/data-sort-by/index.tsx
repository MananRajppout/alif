"use client"
import _ from "lodash";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";

const SortBy = ({ totalCount }: { totalCount: any }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [sortBy, setSortBy] = React.useState("");
  const { register, watch, setValue } = useForm({
    mode: "onChange",
  });

  React.useEffect(() => {
    const currentSortBy = searchParams.get("sortby") || "";
    if (currentSortBy !== sortBy) {
      setValue("sortBy", currentSortBy);
      setSortBy(currentSortBy);
    }
  }, [searchParams]);

  React.useEffect(() => {
    if (watch("sortBy") !== "" || sortBy !== "") {
      const queryParams = new URLSearchParams(searchParams.toString());
      queryParams.set("sortby", watch("sortBy") || "");

      router.push(`${pathname}?${queryParams.toString()}`);
    }
  }, [sortBy]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const sort_by = { ...register("sortBy") };
  return (
    <div className="bg-white py-2 rounded-md md:flex flex-wrap justify-between items-center mb-6 md:py-2 lg:w-[700px] xl:[800px] 2xl:w-[900px]">
      <p className="text-xs font-bold text-black leading-4 px-6 mb-6 md:mb-0">
        We have found <span className="text-themePrimary">{totalCount}</span> Jobs  
      </p>
      <div className="px-2">
        <select
          aria-label="Sort By"
          name="sortBy"
          ref={sort_by.ref}
          onBlur={sort_by.onBlur}
          onChange={(e) => {
            sort_by.onChange(e);
            handleChange(e);
          }}
          className="border-0 focus:shadow-none w-full md:w-40 py-2 bg-light text-xxs text-grayLight text-base font-normal focus-visible:white focus:outline-none svg_icon px-2 appearance-none"
        >
          <option value="" selected={sortBy === ""}>
            Sort By
          </option>
          <option value="ascending" selected={sortBy === "ascending"}>
            {_.capitalize("ascending")}
          </option>
          <option value="descending" selected={sortBy === "descending"}>
            {_.capitalize("descending")}
          </option>
          <option value="featured" selected={sortBy === "featured"}>
            {_.capitalize("featured")}
          </option>
        </select>
      </div>
    </div>
  );
};

export default SortBy;
