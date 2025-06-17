import React, { useState, useEffect } from "react";
import "./BuildingSampleGrid.css";
import { BuildingDetailTable } from "./BuildingDetailTable.jsx";
import { MapCard } from "./MapCard.jsx";

const propertyNames = ["id", "theme", "type", "version", "sources", "names", "subtype", "class", "has_parts", "height", "is_underground", "num_floors", "num_floors_underground", "min_height", "min_floor", "facade_color"];

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
        properties: {
            id: "08b2a100d20a9fff020044fd6378cd69",
            theme: "buildings",
            type: "building",
            subtype: "commercial",
            sources: [
                {
                    dataset: "OpenStreetMap",
                    record_id: "w264768896@32",
                    update_time: "2025-04-29T15:57:41.000Z"
                }
            ],
            version: 0,
            is_underground: false,
            facade_color: "#CBC7AC",
            names: {
                primary: "Flatiron Building",
                common: {
                    "en": "Flatiron Building",
                    "es": "Edificio Flatiron",
                    "fa": "ساختمان فلاتایرون",
                    "he": "בניין פלאטאיירון",
                    "hi": "फ्लाटिरोन बिल्डिंग",
                    "ko": "플랫아이언 빌딩",
                    "ru": "Флэтайрон-билдинг",
                },
                rules: [
                    { variant: "alternate", value: "Fuller Building" }
                ]
            },
            roof_shape: "flat",
            num_floors: 21,
            has_parts: true,
            class: "office",
            height: 86,
        },
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
        properties: {
            id: "08b2a100d2d4bfff02006354283c153f",
            theme: "buildings",
            type: "building",
            subtype: "commercial",
            sources: [
                {
                    dataset: "OpenStreetMap",
                    record_id: "w34633854@71@71",
                    update_time: "2024-03-24T19:00:30.000Z"
                }
            ],
            version: 0,
            is_underground: false,
            facade_color: "#CBC7AC",
            names: {
                primary: "Empire State Building",
                common: {
                    "en": "Empire State Building",
                    "es": "Edificio Empire State",
                    "fa": "ساختمان فلاتایرون",
                    "he": "בניין אמפייר סטייטן",
                    "hi": "एम्पायर स्टेट बिल्डिंग",
                    "ko": "엠파이어 스테이트 빌딩",
                    "ru": "Эмпайр-Стейт-Билдинг",
                    "uk": "Емпайр-Стейт-Білдінг",
                    "zh": "帝国大厦",
                },
            },
            num_floors: 102,
            has_parts: true,
            class: "office",
            height: 443.2,
        },
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
        properties: {
            id: "08b2a100d628afff0200a3e889c1ecf8",
            theme: "buildings",
            type: "building",
            sources: [
                {
                    dataset: "OpenStreetMap",
                    record_id: "w42500770@44",
                    update_time: "2024-03-24T19:21:48.000Z",
                }
            ],
            version: 0,
            is_underground: false,
            names: {
                primary: "Chrysler Building",
                common: {
                    "el": "Κτίριο Κράισλερ",
                    "es": "Edificio Flatiron",
                    "he": "בניין קרייזלר",
                    "ko": "크라이슬러 빌딩",
                    "ru": "Крайслер-билдинг",
                },
            },
            has_parts: true,
        },
    },
    {
        title: "2 World Trade Center",
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
        properties: {
            id: "08b2a10728991fff020008d720e3ae5b",
            theme: "buildings",
            type: "building",
        },
    },
];

export function BuildingSampleGrid() {
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Force a rerender after initial load to fix sizing
    useEffect(() => {}, []);

    return (
        <>
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

            <BuildingDetailTable
                data={samples[selectedIndex].properties}
                propertyNames={propertyNames}
            />
        </>
    );
}
