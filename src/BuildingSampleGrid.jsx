import React, { useState, useEffect } from "react";
import "./BuildingSampleGrid.css";
import MapCard from "./MapCard";

// Four NYC building footprints (approximate) with lat/lng & polygon coords
const samples = [
    {
        title: "Flatiron Building",
        coord: [40.741061, -73.989699],
        footprint: [
            [
                [40.741659, -73.990074],
                [40.741281, -73.988807],
                [40.740507, -73.989047],
                [40.740889, -73.990315],
                [40.741659, -73.990074],
            ],
        ],
    },
    {
        title: "Empire State Building",
        coord: [40.748817, -73.985428],
        footprint: [
            [
                [40.749298, -73.986182],
                [40.748834, -73.984800],
                [40.748379, -73.985048],
                [40.748843, -73.986429],
                [40.749298, -73.986182],
            ],
        ],
    },
    {
        title: "Chrysler Building",
        coord: [40.751652, -73.975311],
        footprint: [
            [
                [40.752092, -73.975777],
                [40.751710, -73.974875],
                [40.751272, -73.975158],
                [40.751652, -73.976053],
                [40.752092, -73.975777],
            ],
        ],
    },
    {
        title: "One World Trade Center",
        coord: [40.712743, -74.013379],
        footprint: [
            [
                [40.713254, -74.013850],
                [40.712473, -74.012352],
                [40.712232, -74.012568],
                [40.713014, -74.014066],
                [40.713254, -74.013850],
            ],
        ],
    },
];

export function BuildingSampleGrid() {
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Force a rerender after initial load to fix sizing
    useEffect(() => {}, []);

    return (
        <div className="grid-container">
            {samples.map((sample, i) => (
                <MapCard
                    key={i}
                    title={sample.title}
                    center={sample.coord}
                    footprint={sample.footprint}
                    selected={i === selectedIndex}
                    onClick={() => setSelectedIndex(i)}
                />
            ))}
        </div>
    );
}
