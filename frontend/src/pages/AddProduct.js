import React, { useState } from "react";

const AddProduct = () => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [stock, setStock] = useState("");
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {

        if (!file) {
            setMessage("Please upload an image.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("name", name);
        formData.append("price", price);
        formData.append("description", description);
        formData.append("stock", stock);

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/products/`, {
                method: "POST",
                body: formData,
            });

            const result = await response.json();
            if (response.ok) {
                setMessage("Product added successfully!");
            } else {
                setMessage(result.error || "Something went wrong");
            }
        } catch (error) {
            setMessage("Error: " + error.message);
        }
    };

    return (
        <div>
            <h2>Add a New Product</h2>
            <form className= "signup" onSubmit={handleSubmit}>
                <input type="text" placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
                <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} required />
                <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} required />
                <button type="submit">Submit</button>
                {message && <p>{message}</p>}
            </form>
            
        </div>
    );
};

export default AddProduct;
