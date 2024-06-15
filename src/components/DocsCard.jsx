import React from 'react';
import { Link } from 'react-router-dom';

const DocsCard = ({ title, url, url2, folder, icon, to, code }) => {
  return (
    <div className="bg-gray-900 text-white text-center hover:bg-white hover:text-gray-900 hover:scale-110 transition duration-200 text-4xl py-4 rounded-lg mx-14 my-2 group">
      <Link to={to} state={{ title: title, name: url, folder: folder, code: code, name2: url2 }} className="flex flex-rows items-center justify-center space-y-2">
        
        <div className="text-lg 2xl:text-2xl text-inherit">{title}</div>
        <div className="text-4xl 2xl:text-5xl text-inherit ml-4">{icon}</div>
      </Link>
    </div>
  );
};


export default DocsCard;