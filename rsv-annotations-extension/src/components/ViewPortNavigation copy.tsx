import React from 'react';
import { Icon } from '@ohif/ui';

const ViewPortNavigation = () => {
    const handleClick = (direction) => {
        console.log(`Joystick ${direction} clicked`);
    };

    return (
        <div className="relative w-12 h-12 mx-auto rounded-full flex items-center justify-center">


            {/* Up Button */}
            <button
                className="absolute -top-1 bg-gray-700 w-4 h-4 rounded-md shadow-md text-primary-light font-bold text-sm flex items-center justify-center hover:text-white hover:text-white hover:bg-secondary-light/60"
                onClick={() => handleClick('up')}
            >
                &#11165;
            </button>

            {/* Down Button */}
            <button
                className="absolute -bottom-1 bg-gray-700 w-4 h-4 rounded-md shadow-md text-primary-light font-bold text-sm flex items-center justify-center hover:text-white hover:bg-secondary-light/60"
                onClick={() => handleClick('down')}
            >
                &#11167;
            </button>

            {/* Left Button */}
            <button
                className="relative -left-1 bg-gray-700 w-4 h-4 rounded-md shadow-md text-primary-light font-bold text-2 flex items-center justify-center hover:text-white hover:bg-secondary-light/60"
                onClick={() => handleClick('left')}
            >
                &#11164;
            </button>
            {/* Center Button */}
            <button
                className="relative  bg-blue-500 w-4 h-4 rounded-full shadow-md text-primary-light font-bold text-2 flex items-center justify-center hover:text-white hover:bg-secondary-light/60"
                onClick={() => handleClick('center')}
            >
                &#11096;
            </button>

            {/* Right Button */}
            <button
                className="relative -right-5 bg-gray-700 w-4 h-4 rounded-md shadow-md text-primary-light font-bold text-2 flex items-center justify-center hover:text-white hover:bg-secondary-light/60"
                onClick={() => handleClick('right')}
            >
                &#11166;
            </button>
        </div>
    );
};

