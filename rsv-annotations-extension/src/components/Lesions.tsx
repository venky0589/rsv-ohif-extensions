import React, { useState } from "react";
import { Icons } from '@ohif/ui-next';

const Lesions = ({ lesionData }) => {
    const [expandedSections, setExpandedSections] = useState({
        targets: true,
        "non-targets": true,
        "new targets": true,
    });

    const toggleSection = (section) => {
        setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };


    return (
        <>
            {lesionData.map(({ section, count, data }) => (
                <div key={section} className="mb-2">
                    <div
                        className="flex justify-between bg-secondary-dark p-2 rounded-md cursor-pointer text-aqua-pale font-bold"
                        onClick={() => toggleSection(section.toLowerCase())}
                    >
                        <span>{section}</span>
                        <span className="bg-blue-500 px-2 rounded-md">{count}</span>
                    </div>

                    {expandedSections[section.toLowerCase()] && (
                        <div className="ml-4 mt-2">
                            {data.map(({ location, lesions }) => (
                                <div key={location} className="mb-2">
                                    <div className="flex items-center justify-between text-gray-300 font-bold">
                                        <span>▾ {location}</span>
                                        <Icons.Magnifier className="w-4 h-4 text-gray-500 cursor-pointer" />
                                    </div>
                                    <hr className="mt-1 bg-aqua-pale "></hr>

                                    {lesions.map(({ id, length, width, slice, orientation }) => (
                                        <div
                                            key={id}
                                            className="flex justify-between items-center bg-gray-700 p-2 rounded-md mt-1"
                                        >
                                            <span className="text-red-500">TL1</span>
                                            <span className="text-gray-300">{id}</span>
                                            <span className="text-gray-400">L: {length} W: {width}</span>
                                            <span className="text-gray-400">S:{slice} {orientation}</span>
                                            <Icons.Trash className="w-4 h-4 text-gray-500 cursor-pointer" />
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </>
    )
};
export default Lesions;

