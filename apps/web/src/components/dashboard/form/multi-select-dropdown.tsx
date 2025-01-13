"use client"
import Multiselect from "multiselect-react-dropdown";
import React from "react";

const MultiSelect = ({
  forwardRef,
  name,
  displayValue,
  selectedValues,
  options,
  disabled,
  placeholder,
  validationSyntax,
  singleSelect,
  className,
  isObject,
  register,
  setValue,
  error,
  emptyRecordMsg,
}: {
  forwardRef: any;
  name: any;
  displayValue: any;
  selectedValues: any;
  options: any;
  disabled: any;
  placeholder: any;
  validationSyntax: any;
  singleSelect: any;
  className: any;
  isObject: any;
  register: any;
  setValue: any;
  error: any;
  emptyRecordMsg: any;
}) => (
  <Multiselect
    customCloseIcon={
      <svg
        width="10"
        height="10"
        className="ml-2 cursor-pointer hover:text-red-500"
        viewBox="0 0 10 10"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9 1L1 9M1 1L9 9"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    }
    options={options}
    {...register(name, {
      required: {
        value: validationSyntax,
        message: `${name} field is required`,
      },
    })}
    placeholder={placeholder}
    name={name}
    selectedValues={selectedValues}
    disable={disabled}
    className={className}
    isObject={isObject}
    style={{
      chips: {
        backgroundColor: "#E8F7EE",
        color: "#66737F",
        borderRadius: "4px",
        fontSize: "16px",
        height: "33px",
      },
      searchBox: {
        padding: "8px",
        border: error ? "1px solid red" : "1px solid #dee2e6",
      },
    }}
    singleSelect={singleSelect}
    selectionLimit={singleSelect ? 1 : null}
    ref={forwardRef}
    displayValue={displayValue}
    onSelect={(selected, item) => {
      setValue(name, selected);
    }}
    onRemove={(selected, item) => {
      setValue(name, selected);
    }}
  />
);

export { MultiSelect };
