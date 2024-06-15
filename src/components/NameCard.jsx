import React from 'react';
import { Link } from 'react-router-dom';

const NameCard = ({ key, title, codigo, onClick }) => {

  
  return (
    <div onClick={() => onClick ({codigo})} className="bg-gray-800 text-white text-center hover:bg-white hover:text-gray-900 hover:scale-110 transition duration-200 text-4xl py-4 rounded-lg mx-14 my-2">
      <Link to={key} title={title} className="flex flex-rows items-center justify-center space-y-2">
        <div className="text-lg 2xl:text-2x text-left">{title}</div>
      </Link>
    </div>
  );
};

export default NameCard;