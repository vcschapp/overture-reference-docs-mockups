import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';

const pySparkCode = `from pyspark.sql.types import *
from pyspark.sql import SparkSession
from pyspark.sql.functions import from_json, col

overture_building_schema = StructType([
    StructField("id", StringType(), True),
    StructField("type", StringType(), True),  # Expect "Feature"
    StructField("geometry", StructType([
        StructField("type", StringType(), False),
        StructField("coordinates", ArrayType(
            # Coordinates array: supports Polygon or MultiPolygon
            ArrayType(ArrayType(ArrayType(DoubleType())))
        ), False)
    ]), False),
    StructField("properties", StructType([
        StructField("theme", StringType(), True),
        StructField("type", StringType(), True),
        StructField("version", IntegerType(), True),
        StructField("level", IntegerType(), True),
        StructField("height", DoubleType(), True),
        StructField("num_floors", IntegerType(), True),
        StructField("num_floors_underground", IntegerType(), True),
        StructField("subtype", StringType(), True),
        StructField("class", StringType(), True),
        StructField("has_parts", BooleanType(), True),
        # 'names' container
        StructField("names", StructType([
            StructField("primary", StringType(), True),
            StructField("common", MapType(StringType(), StringType()), True),
            StructField("rules", ArrayType(StructType([
                StructField("variant", StringType(), True),
                StructField("value", StringType(), True)
            ])), True),
        ]), True),
        # 'shape' container
        StructField("shape", StructType([
            StructField("area", DoubleType(), True),
            StructField("centroid", StructType([
                StructField("type", StringType(), True),
                StructField("coordinates", ArrayType(DoubleType()), True)
            ]), True)
        ]), True),
        StructField("is_underground", BooleanType(), True),
        StructField("sources", ArrayType(StructType([
            StructField("property", StringType(), True),
            StructField("dataset", StringType(), True),
            StructField("confidence", DoubleType(), True),
        ])), True),
        StructField("ext_foo", StringType(), True),  # Example of extension fields
        StructField("ext_bar", StringType(), True),
    ]), False),
])
`

const jsonSchema = `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Overture Building Feature",
  "type": "object",
  "required": ["type", "id", "geometry", "properties"],
  "properties": {
    "type": { "const": "Feature" },
    "id": { "type": "string" },
    "geometry": {
      "oneOf": [
        { "$ref": "https://geojson.org/schema/Polygon.json" },
        { "$ref": "https://geojson.org/schema/MultiPolygon.json" }
      ]
    },
    "properties": {
      "type": "object",
      "unevaluatedProperties": false,
      "required": ["theme", "type", "version", "has_parts", "sources"],
      "properties": {
        "theme": { "const": "buildings" },
        "type": { "const": "building" },
        "version": { "type": "integer", "minimum": 0 },
        "subtype": { "type": "string" },
        "class": { "type": "string" },
        "level": { "type": "integer" },
        "height": { "type": "number" },
        "num_floors": { "type": "integer" },
        "num_floors_underground": { "type": "integer" },
        "min_height": { "type": "number" },
        "min_floor": { "type": "integer" },
        "is_underground": { "type": "boolean" },
        "names": {
          "type": "object",
          "unevaluatedProperties": false,
          "properties": {
            "primary": { "type": "string" },
            "common": {
              "type": "object",
              "additionalProperties": { "type": "string" }
            },
            "rules": {
              "type": "array",
              "items": {
                "type": "object",
                "required": ["variant", "value"],
                "properties": {
                  "variant": { "type": "string" },
                  "value": { "type": "string" }
                },
                "additionalProperties": false
              }
            }
          }
        },
        "shape": {
          "type": "object",
          "unevaluatedProperties": false,
          "properties": {
            "area": { "type": "number" },
            "centroid": {
              "type": "object",
              "required": ["type", "coordinates"],
              "properties": {
                "type": { "const": "Point" },
                "coordinates": {
                  "type": "array",
                  "items": { "type": "number" },
                  "minItems": 2,
                  "maxItems": 3
                }
              },
              "additionalProperties": false
            }
          }
        },
        "sources": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["property", "dataset"],
            "properties": {
              "property": { "type": "string" },
              "dataset": { "type": "string" },
              "confidence": { "type": "number" }
            },
            "additionalProperties": false
          }
        }
      }
    }
  },
  "additionalProperties": false
}
`

export function DerivedSchemas() {
    const [selectedTab, setSelectedTab] = useState('spark');

    return (
        <div className="tabs">
            <div className="tab-buttons">
                <button
                    className={selectedTab === 'spark' ? 'active' : ''}
                    onClick={() => setSelectedTab('spark')}
                >
                    Spark
                </button>
                <button
                    className={selectedTab === 'geojson' ? 'active' : ''}
                    onClick={() => setSelectedTab('geojson')}
                >
                    GeoJSON
                </button>
            </div>

            <div className="tab-content">
                {selectedTab === 'spark' && (
                    <div>
                        <p>
                            The following Python code creates a PySpark schema for a dataframe that
                            contains rows of Overture building data.
                        </p>

                        <p>
                            This PySpark schema is automatically derived from the building schema. For a full list of
                            artifacts you can derive from an Overture schema, see the <a href="nowhere"><code>conductor</code> CLI</a>.
                        </p>

                        <SyntaxHighlighter language="python" style={vs} wrapLines>
                            {pySparkCode}
                        </SyntaxHighlighter>
                    </div>
                )}
                {selectedTab === 'geojson' && (
                    <div>
                        <p>
                            The following <a href="https://json-schema.org/">JSON Schema</a> validates
                            a <a href="https://datatracker.ietf.org/doc/html/rfc7946">GeoJSON</a> feature
                            that represents an Overture building.
                        </p>

                        <p>
                            This PySpark schema is automatically derived from the building schema. For a full list of
                            artifacts you can derive from an Overture schema, see the <a
                            href="nowhere"><code>conductor</code> CLI</a>.
                        </p>

                        <SyntaxHighlighter language="json" style={vs} wrapLines>
                            {jsonSchema}
                        </SyntaxHighlighter>

                        <pre>
              {JSON.stringify(
                  {
                      type: 'FeatureCollection',
                      features: [],
                  },
                  null,
                  2
              )}
            </pre>
                    </div>
                )}
            </div>
        </div>
    );
}
