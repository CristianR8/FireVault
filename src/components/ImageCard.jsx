
import React from "react";

const ImageCard = ({ imageSrc, title, description, onClick }) => {
    return (
        <div
            className="group relative cursor-pointer  items-center justify-center overflow-hidden transition-shadow hover:shadow-xl hover:shadow-black/20 border-4 border-gray-900 bg-gray-300 rounded-lg"
            onClick={onClick}
        >
            <div className="h-96 2xl:h-custom-xl w-72 2xl:w-80">
                <img
                    className="h-full xl:w-full w-full object-cover transition-transform duration-500 group-hover:rotate-3 group-hover:scale-125 font-mono"
                    src={imageSrc}
                    alt={title}
                />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black group-hover:from-black/70 group-hover:via-black/60 group-hover:to-black/70"></div>
            <div className="absolute inset-0 flex translate-y-[60%] flex-col items-center p-16 text-center transition-all duration-500 group-hover:translate-y-0">
                <h1 className="font-serif text-xl font-bold text-white">{title}</h1>
                <p className="text-lg italic text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {description}
                </p>

            </div>
        </div>
    );
};

export default ImageCard;


