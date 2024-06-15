import React from "react";
import Select from "react-select";

const CustomSelectField = ({ name }) => {
  const options = [
    { label: "B" },
    { label: "R" },
    { label: "M" },
    { label: "N. A." },
  ];

  return (
    <div className="col-span-1">
      <label className="block text-2xl font-mono text-white font-semibold mt-4">
        {name}
      </label>
      <Select
        options={options}
        placeholder="Seleccione un estado"
        className="bg-white border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
    </div>
  );
};

export default CustomSelectField;
