import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BallTriangle } from 'react-loader-spinner'

const Spinner = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <BallTriangle
                height={100}
                width={100}
                radius={5}
                color="#212F3D"
                ariaLabel="ball-triangle-loading"
                wrapperClass={{}}
                wrapperStyle=""
                visible={true}
            />
        </div>
    );
};

export default Spinner;