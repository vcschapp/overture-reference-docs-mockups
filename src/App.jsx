import { useState, createContext, useContext } from 'react';
import './App.css';
import { DerivedSchemas } from './DerivedSchemas.jsx';

// ------------- Filter Context Setup -------------
const FilterContext = createContext();

function PropertyFilterToggle({ children }) {
    const [mode, setMode] = useState('specific');

    return (
        <FilterContext.Provider value={{ mode, setMode }}>
            <div className="filter-buttons">
                <button
                    className={mode === 'specific' ? 'active' : ''}
                    onClick={() => setMode('specific')}
                >
                    Building Properties
                </button>
                <button
                    className={mode === 'standard' ? 'active' : ''}
                    onClick={() => setMode('standard')}
                >
                    Standard Properties
                </button>
                <button
                    className={mode === 'all' ? 'active' : ''}
                    onClick={() => setMode('all')}
                >
                    All Properties
                </button>
            </div>
            <div className="property-list">{children}</div>
        </FilterContext.Provider>
    );
}

function useFilterMode() {
    return useContext(FilterContext);
}

function PropertyConstraints({
                                 required,
                                 minLength, maxLength,
                                 minValue, maxValue,
                                 exclusiveMinValue, exclusiveMaxValue,
                                 pattern,
                                 allowedValues,
                                 geometryTypes
                            }) {
    return (
        <div>
            <p>{required ? "Required: Yes" : "Optional: Yes"}</p>

            {minLength !== undefined && maxLength !== undefined && (
                <p>Length: {minLength}..{maxLength}</p>
            )}

            {minLength !== undefined && maxLength === undefined && (
                <p>Length: Minimum {minLength}</p>
            )}

            {minLength === undefined && maxLength !== undefined && (
                <p>Length: Maximum {maxLength}</p>
            )}

            {minValue !== undefined && maxValue !== undefined && (
                <p>Allowed Values: <code>[{minValue}..{maxValue}] (inclusive range)</code></p>
            )}

            {minValue !== undefined && maxValue === undefined && (
                <p>Allowed Values: <code>&ge; {minValue}</code></p>
            )}

            {minValue === undefined && maxValue !== undefined && (
                <p>Allowed Values: <code>&le; {maxValue}</code></p>
            )}

            {exclusiveMinValue !== undefined && exclusiveMaxValue !== undefined && (
                <p>Allowed Values: <code>({exclusiveMinValue}..{exclusiveMaxValue}) (exclusive range)</code></p>
            )}

            {exclusiveMinValue !== undefined && exclusiveMaxValue === undefined && (
                <p>Allowed Values: <code>&gt; {exclusiveMinValue}</code></p>
            )}

            {exclusiveMinValue === undefined && exclusiveMaxValue !== undefined && (
                <p>Allowed Values: <code>&lt; {exclusiveMaxValue}</code></p>
            )}

            {pattern !== undefined && (
                <p>Pattern: <code>{pattern}</code></p>
            )}

            {allowedValues !== undefined && (
                <p>Allowed Values: {
                    allowedValues.reduce((acc, str, idx) => {
                            acc.push(<code key={idx}>{str}</code>);
                            if (idx < allowedValues.length - 1) acc.push(', ');
                            return acc;
                        }, [])
                }
                </p>
            )}

            {geometryTypes !== undefined && (
                <p>Geometry Type{geometryTypes.length > 1 ? "s" : ""}: {
                    geometryTypes.reduce((acc, str, idx) => {
                        acc.push(<code key={idx}>{str}</code>);
                        if (idx < geometryTypes.length - 1) acc.push(', ');
                        return acc;
                    }, [])
                }
                </p>
            )}

        </div>
    );
}

function ItemConstraints( { minItems, maxItems, uniqueItems }) {
    return (
        <div>
            {minItems !== undefined && maxItems !== undefined && (
                <p>Length {minItems}..{maxItems}</p>
            )}

            {minItems !== undefined && maxItems === undefined && (
                <p>Length: Minimum {minItems}</p>
            )}

            {minItems === undefined && maxItems !== undefined && (
                <p>Length: Maximum {maxItems}</p>
            )}

            {uniqueItems && (<p>Unique Items: Yes</p>)}
        </div>
    )
}

function Items({ type, constraints }) {
    return (
        <p>Items: <a href="nowhere"><code>{type}</code></a> <ItemConstraints {...constraints}/></p>
    )
}

const builtinTypes = new Set(["array", "boolean", "float", "geometry", "integer", "string"]);

// ------------- Property Component -------------
function Property({ category, name, description, type, example, constraints, items }) {
    const { mode } = useFilterMode();

    const shouldShow =
        mode === 'all' ||
        (mode === 'standard' && category === 'standard') ||
        (mode === 'specific' && category === 'specific');

    if (!shouldShow) return null;

    return (
        <div className={`property ${category}`}>
            <strong>{name}</strong>: {description}

            <div style={{ marginLeft: '2em' }}>
                <p>Type: <code>
                    {builtinTypes.has(type) ? type : <a href="nowhere">{type}</a>}
                </code></p>

                <PropertyConstraints {...constraints}/>

                {items && (<Items {...items}/>)}

                {example && (<p>Example: <code>{example}</code></p>)}
            </div>
        </div>
    );
}

// ------------- App Component -------------
function App() {
    return (
        <div className="page">
            <main className="content">
                <h1 id="building">Building</h1>

                <div>
                    <p>
                        Buildings are human-made structures with roofs or interior
                        spaces that are permanently or semi-permanently in one place
                        (<a href="https://wiki.openstreetmap.org/wiki/Key:building">OSM building definition</a>).

                    </p>
                </div>

                <div>
                    <h2 id="properties">Properties</h2>
                    <div>
                        <PropertyFilterToggle>
                            <Property
                                category="standard"
                                name="id"
                                description="A feature ID. This may be an ID associated with the Global Entity Reference System (GERS) if—and-only-if the feature represents an entity that is part of GERS."
                                type="string"
                                constraints={{ required: true, minLength: 1, pattern: " ^(\\S.*)?\\S$" }}
                                example="f17ee05a-ccbc-47c0-bb8e-f0a566d6f2c4"
                            />
                            <Property
                                category="standard"
                                name="theme"
                                description="Top-level Overture theme this feature belongs to"
                                type="string"
                                constraints={{ required: true, allowedValues: ["buildings"]}}
                            />
                            <Property
                                category="standard"
                                name="type"
                                description="Specific feature type within the theme"
                                type="string"
                                constraints={{ required: true, allowedValues: ["building"]}}
                            />
                            <Property
                                category="standard"
                                name="geometry"
                                description="Feature geometry"
                                type="geometry"
                                constraints={{ required: true, geometryTypes: ["Polygon", "MultiPolygon"]}}
                            />
                            <Property
                                category="standard"
                                name="version"
                                description="Version number of the feature, incremented in each
                                             Overture release where the geometry or attributes of
                                             this feature changed."
                                type="integer"
                                constraints={{ required: true, minValue: 0, maxValue: 4294967295 }}
                            />
                            <Property
                                category="standard"
                                name="sources"
                                description="The array of source information for the properties of a
                                             given feature, with each entry being a source object which
                                             lists the property in JSON Pointer notation and the dataset
                                             that specific value came from. All features must have a root
                                             level source which is the default source if a specific
                                             property's source is not specified."
                                type="array"
                                constraints={{ required: true, }}
                                items={{ type: "source", constraints: { minItems: 1, uniqueItems: true }}}
                            />
                            <Property
                                category="standard"
                                name="names"
                                description="Names by which the feature is called."
                                type="names"
                            />
                            <Property
                                category="specific"
                                name="subtype"
                                description="A broad category of the building type/purpose. When the
                                             current use of the building does not match the built purpose,
                                             the subtype should be set to represent the current use of the
                                             building."
                                type="string"
                                constraints={{ required: true, allowedValues: ["agricultural", "civic", "commercial", "education", "entertainment", "industrial", "medical", "military", "outbuilding", "religious", "residential", "service", "transportation"] }}
                            />
                            <Property
                                category="specific"
                                name="class"
                                description="Further delineation of the building's built purpose."
                                type="string"
                                constraints={{
                                    required: true,
                                    allowedValues: [
                                        "agricultural",
                                        "allotment_house",
                                        "apartments",
                                        "barn",
                                        "beach_hut",
                                        "boathouse",
                                        "bridge_structure",
                                        "bungalow",
                                        "bunker",
                                        "cabin",
                                        "carport",
                                        "cathedral",
                                        "chapel",
                                        "church",
                                        "civic",
                                        "college",
                                        "commercial",
                                        "cowshed",
                                        "detached",
                                        "digester",
                                        "dormitory",
                                        "dwelling_house",
                                        "factory",
                                        "farm",
                                        "farm_auxiliary",
                                        "fire_station",
                                        "garage",
                                        "garages",
                                        "ger",
                                        "glasshouse",
                                        "government",
                                        "grandstand",
                                        "greenhouse",
                                        "guardhouse",
                                        "hangar",
                                        "hospital",
                                        "hotel",
                                        "house",
                                        "houseboat",
                                        "hut",
                                        "industrial",
                                        "kindergarten",
                                        "kiosk",
                                        "library",
                                        "manufacture",
                                        "military",
                                        "monastery",
                                        "mosque",
                                        "office",
                                        "outbuilding",
                                        "parking",
                                        "pavilion",
                                        "post_office",
                                        "presbytery",
                                        "public",
                                        "religious",
                                        "residential",
                                        "retail",
                                        "roof",
                                        "school",
                                        "semi",
                                        "semidetached_house",
                                        "service",
                                        "shed",
                                        "shrine",
                                        "silo",
                                        "slurry_tank",
                                        "sports_centre",
                                        "sports_hall",
                                        "stable",
                                        "stadium",
                                        "static_caravan",
                                        "stilt_house",
                                        "storage_tank",
                                        "sty",
                                        "supermarket",
                                        "synagogue",
                                        "temple",
                                        "terrace",
                                        "toilets",
                                        "train_station",
                                        "transformer_tower",
                                        "transportation",
                                        "trullo",
                                        "university",
                                        "warehouse",
                                        "wayside_shrine"
                                    ]
                            }}
                            />
                            <Property
                                category="specific"
                                name="has_parts"
                                description="Flag indicating whether the building has parts."
                                type="boolean"
                            />
                            <Property
                                category="specific"
                                name="height"
                                description="Height of the building or part in meters. The height is the
                                             distance from the lowest point to the highest point."
                                type="float"
                                constraints={{ exclusiveMinValue: 0 }}
                            />
                            <Property
                                category="specific"
                                name="is_underground"
                                description="Whether the entire building or part is completely below ground. This is
                                             useful for rendering which typically omits these buildings or styles them
                                             differently because they are not visible above ground. This is different
                                             than the level column which is used to indicate z-ordering of elements and
                                             negative values may be above ground."
                                type="boolean"
                            />
                            <Property
                                category="specific"
                                name="num_floors"
                                description="Number of above-ground floors of the building or part."
                                type="integer"
                                constraints={{ exclusiveMinValue: 0 }}
                            />
                            <Property
                                category="specific"
                                name="num_floors_underground"
                                description="Number of below-ground floors of the building or part."
                                type="integer"
                                constraints={{ exclusiveMinValue: 0 }}
                            />
                            <Property
                                category="specific"
                                name="min_height"
                                description="The height of the bottom part of building in meters. Used if a building or
                                             part of building starts above the ground level."
                                type="float"
                                constraints={{ exclusiveMinValue: 0 }}
                            />
                            <Property
                                category="specific"
                                name="min_floor"
                                description='The "start" floor of this building or part. Indicates that the building or
                                             part is "floating" and its bottom-most floor is above ground level, usually
                                             because it is part of a larger building in which some parts do reach down
                                             to ground level. An example is a building that has an entry road or
                                             driveway at ground level into an interior courtyard, where part of the
                                             building bridges above the entry road. This property may sometimes be
                                             populated when min_height is missing and in these cases can be used as a proxy
                                             for min_height.'
                                type="integer"
                                constraints={{ exclusiveMinValue: 0 }}
                            />
                            <Property
                                category="specific"
                                name="facade_color"
                                description='The color (name or color triplet) of the facade of a building or building part in hexadecimal.'
                                type="string"
                                constraints={{ pattern: "^(\w+|#[0-9a-f]{6})$"}}
                            />
                        </PropertyFilterToggle>
                    </div>
                </div>

                <div>
                    <h2 id="examples">Examples</h2>

                    OK an idea I have here is to put a small map non-scrollable static map in here with
                    polygons you can overlay.
                </div>

                <div>
                    <h2 id="schemas">Derived Schemas</h2>

                    <DerivedSchemas/>
                </div>

                <div>
                    <h2 id="extensions">Extensions</h2>

                    <p>
                        The Overture buildings schema can be extended! (<a href="nowhere">Here's how.</a>)
                    </p>

                    <div>
                        <h3 id="verified-extensions">Verified Extensions</h3>

                        The following official building schema extensions have gone through the Overture schema design
                        process and are verified to have at least one high-quality GERS-referenced dataset.

                        <table>
                            <thead>
                            <tr>
                                <th>
                                    Extension
                                </th>
                                <th>
                                    Description
                                </th>
                                <th>
                                    Datasets
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>
                                    <a href="npmjs.org">@overture-maps-ext/building-door-color</a>
                                </td>
                                <td>
                                    Comprehensive global door color dataset
                                </td>
                                <td>
                                    4
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <a href="npmjs.org">@overture-maps-ext/building-window-tint-us</a>
                                </td>
                                <td>
                                    Building window tints in the United States.
                                </td>
                                <td>
                                    2
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    <div>
                        <h3 id="all-extensions">All Extensions</h3>

                        <p>
                            The full list of building schema extensions, including unofficial extensions, can be found
                            in the <a href="nowhere">Overture Extension Registry</a>.
                        </p>
                    </div>
                </div>

                <div>
                    <h2 id="version">Version</h2>

                    <p>
                    This reference page was generated on 2025-06-13 14:57 PT
                        using <a href="https://npmjs.org">@overture-maps/schema-building</a> <code>v1.3.4</code> as
                        the schema version and the Overture Maps <a
                        href="https://docs.overturemaps.org/release/2025-04-23.0/">2025-04-23</a> data
                        release for the example data.
                    </p>
                </div>
            </main>

            <nav className="toc">
                <strong>On this page</strong>
                <ul>
                <li><a href="#building">Building</a></li>
                    <li>
                        <ul>
                            <li><a href="#properties">Properties</a></li>
                            <li><a href="#examples">Examples</a></li>
                            <li><a href="#schemas">Derived Schemas</a></li>
                            <li><a href="#extensions">Extensions</a></li>
                            <li>
                                <ul>
                                    <li><a href="#verified-extensions">Verified Extensions</a></li>
                                    <li><a href="#all-extensions">All Extensions</a></li>
                                </ul>
                            </li>
                            <li><a href="#version">Version</a></li>
                        </ul>
                    </li>
                </ul>
            </nav>
        </div>
    )
        ;
}

export default App;
