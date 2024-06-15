import React from "react";


const CustomTextInput = ({ label, className, type }) => {
  return (
    <div className={`col-span-${className}`}>
      <label className="block text-xl font-mono text-white font-semibold mt-4">
        {label}
      </label>
      <input
        type={type}
        className="border border-gray-400 rounded-lg px-4 w-full text-gray-800"
      />
    </div>
  );
};

export default CustomTextInput;
