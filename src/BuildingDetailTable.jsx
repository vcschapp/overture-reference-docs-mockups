import React from "react";
import "./BuildingDetailTable.css";

export function BuildingDetailTable({ data, propertyNames }) {
    if (!data) return null;

    return (
        <table className="detail-table">
            <tbody>
            {propertyNames.map((key) =>
                key in data ? (
                    <tr key={key}>
                        <td className="key">{key}</td>
                        <td className="value">{JSON.stringify(data[key])}</td>
                    </tr>
                ) : null
            )}
            </tbody>
        </table>
    );
}
