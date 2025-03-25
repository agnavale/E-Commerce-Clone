import { useState } from "react";

const SearchBar = ({ setQuery }) => {
    const [searchText, setSearchText] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setQuery(searchText);
    };

    return (
        <form onSubmit={handleSubmit} className="search-bar">
            <input
                type="text"
                placeholder="Search for products..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
            />
            <button type="submit">
                <span className="material-symbols-outlined">search</span>
            </button> 
        </form>
    );
};

export default SearchBar
