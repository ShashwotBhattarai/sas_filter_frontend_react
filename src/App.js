import React, { useState } from "react";
import "./App.css";

const FilterComponent = () => {
	const [queries, setQueries] = useState([{ condition: "", operator: "", value: "" }]);
	const [logic, setLogic] = useState("or");
	const [searchResult, setSearchResult] = useState(null);

	const handleQueryChange = (index, field, newValue) => {
		const newQueries = [...queries];
		newQueries[index][field] = newValue;
		setQueries(newQueries);
	};

	const addQuery = () => {
		setQueries([...queries, { condition: "", operator: "", value: "" }]);
	};

	const removeQuery = (index) => {
		const newQueries = [...queries];
		newQueries.splice(index, 1);
		setQueries(newQueries);
	};

	const handleLogicChange = (newLogic) => {
		setLogic(newLogic);
	};

	const handleSearch = async () => {
		try {
			const response = await fetch("http://localhost:3000/filter", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ queries, logic }),
			});

			if (!response.ok) {
				throw new Error("Failed to fetch data");
			}

			const result = await response.json();
			console.log(result);
			setSearchResult(result);
		} catch (error) {
			console.error("Error:", error.message);
			setSearchResult(null);
		}
	};

	return (
		<div>
			<h2>Filter Component</h2>
			{queries.map((query, index) => (
				<div id="inputdiv" key={index}>
					<label>Condition:</label>
					<select
						value={query.condition}
						onChange={(e) => handleQueryChange(index, "condition", e.target.value)}
					>
						<option value="title">Title</option>
						<option value="product_type">Product Type</option>
						<option value="vendor">Vendor</option>
						<option value="tags">Tags</option>
						<option value="price">Price</option>
						<option value="compare_at_price">Compare at Price</option>
						<option value="weight">Weight</option>
						<option value="inventory_stock">Inventory Stock</option>
						<option value="variants_title">Variants Title</option>
					</select>

					<label>Operator:</label>
					<select
						value={query.operator}
						onChange={(e) => handleQueryChange(index, "operator", e.target.value)}
					>
						<option value="is equal to">Is Equal To</option>
						<option value="is not equal to">Is Not Equal To</option>
						<option value="starts with">Starts With</option>
						<option value="ends with">Ends With</option>
						<option value="contains">Contains</option>
						<option value="does not contain">Does Not Contain</option>
						<option value="is greater than">Is Greater Than</option>
						<option value="is less than">Is Less Than</option>
						<option value="is not empty">Is Not Empty</option>
						<option value="is empty">Is Empty</option>
					</select>

					<label>Value:</label>
					<input
						type="text"
						value={query.value}
						onChange={(e) => handleQueryChange(index, "value", e.target.value)}
					/>

					<button type="button" onClick={() => removeQuery(index)}>
						Remove
					</button>
				</div>
			))}
			<button type="button" onClick={addQuery}>
				Add Query
			</button>

			<label>Logic:</label>
			<select value={logic} onChange={(e) => handleLogicChange(e.target.value)}>
				<option value="and">AND</option>
				<option value="or">OR</option>
			</select>

			<button type="button" onClick={handleSearch}>
				Search
			</button>

			{searchResult && (
				<div>
					<h3>Search Result:</h3>
					<pre>{JSON.stringify(searchResult, null, 2)}</pre>
				</div>
			)}
		</div>
	);
};

export default FilterComponent;
