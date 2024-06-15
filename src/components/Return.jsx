import React from 'react';

const Return = ({ onClick }) => {

    return (
        <button
            className="bg-slate-200 hover:bg-slate-300 rounded m-5 py-2 px-4 text-black text-base md:text-lg flex items-center justify-center space-x-2 mx-auto absolute bottom-0 right-0 p-5"
            onClick={onClick}
        >
            <svg
                className="h-8 w-8 2xl:h-12 2xl:w-12 text-gray-900"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                />
            </svg>

            <span className='2xl:text-2xl'>Volver</span>
        </button>
    );
};

export default Return;