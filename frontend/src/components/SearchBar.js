import { useState } from "react";

const SearchBar = ({ setProducts }) => {
    const [searchText, setSearchText] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [fileName, setFileName] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        let url = "";
        let data = {};

        if (imageFile) {
            // Image search
            const formData = new FormData();
            formData.append("file", imageFile);
            url = `${process.env.REACT_APP_BACKEND_URI}/api/products/imageSearch`;
            data = formData;
        } else {
            // Text search
            url = `${process.env.REACT_APP_BACKEND_URI}/api/products/textSearch?search=${searchText}`;
        }

        try {
            const response = await fetch(url, {
                method: imageFile ? "POST" : "GET",
                body: imageFile ? data : null,
            });
            const products = await response.json();
            setProducts(products); 
        } catch (error) {
            console.error("Search error:", error);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setFileName(file.name);
        } else {
            setImageFile(null);
            setFileName("");
            
        }
    };

    return (
        <form onSubmit={handleSubmit} className="search-bar">
            {/* Text Input */}
            <input
                type="text"
                placeholder="Search for products..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
            />
            <button type="submit">
                <span className="material-symbols-outlined">search</span>
            </button>

            {/* Image Upload */}
            <label for="imageUpload" class="icon-button">
                <p class="file-name">{fileName}</p>
                <span class="material-symbols-outlined">upload</span>
            </label>
            <input
                type="file"
                accept="image/*"
                id="imageUpload"
                onChange={handleFileChange}
            />
        </form>
    );
};

export default SearchBar;
