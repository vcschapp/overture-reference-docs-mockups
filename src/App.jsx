import { useState, createContext, useContext } from 'react';
import './App.css';

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
                    className={mode === 'common' ? 'active' : ''}
                    onClick={() => setMode('common')}
                >
                    Common Properties
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

// ------------- Property Component -------------
function Property({ type, name, description }) {
    const { mode } = useFilterMode();

    const shouldShow =
        mode === 'all' ||
        (mode === 'common' && type === 'common') ||
        (mode === 'specific' && type === 'specific');

    if (!shouldShow) return null;

    return (
        <div className={`property ${type}`}>
            <strong>{name}</strong>: {description}
        </div>
    );
}

// ------------- App Component -------------
function App() {
    return (
        <div className="page">
            <main className="content">
                <h1 id="building">Building</h1>

                <h2 id="overview">Overview</h2>
                <p>
                    Buildings are human-made structures with roofs or interior
                    spaces that are permanently or semi-permanently in one place
                    (<a href="https://wiki.openstreetmap.org/wiki/Key:building">OSM building definition</a>).

                </p>

                <h2 id="properties">Properties</h2>
                <div>
                    <PropertyFilterToggle>
                        <Property
                            type="common"
                            name="id"
                            description="A unique identifier for the resource."
                        />
                        <Property
                            type="common"
                            name="createdAt"
                            description="Timestamp of creation."
                        />
                        <Property
                            type="specific"
                            name="retryLimit"
                            description="Maximum number of retry attempts."
                        />
                        <Property
                            type="specific"
                            name="timeout"
                            description="Timeout in seconds."
                        />
                    </PropertyFilterToggle>
                </div>

                <h2 id="examples">Examples</h2>
                <p>Some code here...</p>
            </main>

    <nav className="toc">
        <strong>On this page</strong>
        <ul>
            <li><a href="#overview">Overview</a></li>
            <li><a href="#properties">Properties</a></li>
            <li><a href="#examples">Examples</a></li>
        </ul>
    </nav>
</div>
)
    ;
}

export default App;
