import React from 'react';
import Select from "react-select";

function SelectInput({ options, colSpan, label, placeholder }) {
  return (
    <div className={`col-span-${colSpan}`}>
      <label className="block text-2xl font-mono text-white font-semibold">
        {label}
      </label>
      <Select
        options={options}
        placeholder={placeholder}
        className="bg-white border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
      </Select>
    </div>
  );
}

export default SelectInput;
