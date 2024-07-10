import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BallTriangle } from 'react-loader-spinner'
import GridLoader from "react-spinners/GridLoader";


const Spinner = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <GridLoader
                size={30}
                color="#dc2626"
            />
        </div>
    );
};

export default Spinner;