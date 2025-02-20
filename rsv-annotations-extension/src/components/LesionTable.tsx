import React, { useState } from "react";
import { Icons } from '@ohif/ui-next';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@ohif/ui-next';
import Lesions from "./Lesions";

const LesionTable = (props) => {

    const screen_lesionData = [
        {
            section: "Targets",
            count: 2,
            data: [
                {
                    location: "Liver Right Lobe",
                    lesions: [
                        { id: 102, length: 23.0, width: 11.5, slice: 141, orientation: "AXI" },
                        { id: 103, length: 19.0, width: 9.5, slice: 131, orientation: "AXI" },
                    ],
                },
            ],
        },
        {
            section: "Non-Targets",
            count: 1,
            data: [
                {
                    location: "Liver Right Lobe",
                    lesions: [{ id: 201, length: 30.0, width: 10.5, slice: 170, orientation: "AXI" }],
                },
            ],
        },
        {
            section: "New Targets",
            count: 1,
            data: [
                {
                    location: "Left Lung",
                    lesions: [{ id: 301, length: 32.0, width: 12.5, slice: 132, orientation: "AXI" }],
                },
            ],
        },
    ];

    const fup1_lesionData = [
        {
            section: "Targets",
            count: 2,
            data: [
                {
                    location: "Liver Right Lobe",
                    lesions: [
                        { id: 101, length: 43.0, width: 61.5, slice: 141, orientation: "AXL" },

                    ],
                },
            ],
        },
        {
            section: "Non-Targets",
            count: 1,
            data: [
                {
                    location: "Liver Right Lobe",
                    lesions: [{ id: 201, length: 30.0, width: 10.5, slice: 170, orientation: "AXI" },
                    { id: 202, length: 30.0, width: 10.5, slice: 170, orientation: "AXI" }],
                },
            ],
        },
        {
            section: "New Targets",
            count: 1,
            data: [
                {
                    location: "Left Lung",
                    lesions: [{ id: 301, length: 32.0, width: 12.5, slice: 132, orientation: "AXI" }],
                },
            ],
        },
    ];

    const fup2_lesionData = [
        {
            section: "Targets",
            count: 2,
            data: [
                {
                    location: "Liver Right Lobe",
                    lesions: [
                        { id: 102, length: 23.0, width: 11.5, slice: 141, orientation: "AXI" },
                        { id: 103, length: 19.0, width: 9.5, slice: 131, orientation: "AXI" },
                    ],
                },
            ],
        },
        {
            section: "Non-Targets",
            count: 1,
            data: [
                {
                    location: "Liver Right Lobe",
                    lesions: [{ id: 201, length: 30.0, width: 10.5, slice: 170, orientation: "AXI" }],
                },
            ],
        },
        {
            section: "New Targets",
            count: 1,
            data: [
                {
                    location: "Left Lung",
                    lesions: [{ id: 301, length: 32.0, width: 12.5, slice: 132, orientation: "2XI" },
                    { id: 302, length: 55.0, width: 16.5, slice: 132, orientation: "SXI" },
                    { id: 303, length: 2.0, width: 19.5, slice: 132, orientation: "SG" }],
                },
            ],
        },
    ];
    //    
    return (
        <div className="text-primary-light p-4 rounded-md shadow-md w-full text-[13px]">

            <Tabs className="text-xs text-gray-400 mb-3 overflow-x-auto" defaultValue="Screening" >
                <TabsList className="h-12 text-aqua-pale bg-secondary-dark " >
                    <TabsTrigger value="Screening" className="text-aqua-pale">
                        <span>Screening<br />21-Nov-22</span>
                    </TabsTrigger>
                    <TabsTrigger value="Follow-up 1" className="text-aqua-pale">
                        <span>Follow-up 1<br />22-Aug-23</span>
                    </TabsTrigger>
                    <TabsTrigger value="Follow-up 2" className="text-aqua-pale">
                        <span>Follow-up 2<br />10-Mar-24</span>
                    </TabsTrigger>
                    <TabsTrigger value="Follow-up 3" className="text-aqua-pale">
                        <span>Follow-up 3<br />10-Mar-24</span>
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="Screening">
                    <Lesions lesionData={screen_lesionData}></Lesions>
                </TabsContent>
                <TabsContent value="Follow-up 1">
                    <Lesions lesionData={fup1_lesionData}></Lesions>
                </TabsContent>
                <TabsContent value="Follow-up 2">
                    <Lesions lesionData={fup2_lesionData}></Lesions>
                </TabsContent>
                <TabsContent value="Follow-up 3">
                    <Lesions lesionData={fup1_lesionData}></Lesions>
                </TabsContent>
            </Tabs>
            {/* Timepoints */}
            {/* <div className="flex justify-between text-xs text-gray-400 mb-3">
                <span>Follow-up 8<br />22-Nov-24</span>
                <span>Follow-up 7<br />22-Sep-24</span>
                <span>Baseline<br />21-Nov-23</span>
            </div> */}

            {/* Lesion Sections */}

        </div>
    );
};

export default LesionTable;
