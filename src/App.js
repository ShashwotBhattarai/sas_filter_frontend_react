import React, { useState } from "react";
import "./App.css";

const operators = {
	title: ["is equal to", "is not equal to", "starts with", "ends with", "contains", "does not contain"],
	product_type: ["is equal to", "is not equal to", "starts with", "ends with", "contains", "does not contain"],
	// product_category: ["is equal to"],
	vendor: ["is equal to", "is not equal to", "starts with", "ends with", "contains", "does not contain"],
	tags: ["is equal to"],
	price: ["is equal to", "is not equal to", "is greater than", "is less than"],
	compare_at_price: [
		"is equal to",
		"is not equal to",
		"is greater than",
		"is less than",
		"is not empty",
		"is empty",
	],
	weight: ["is equal to", "is not equal to", "is greater than", "is less than"],
	inventory_stock: ["is equal to", "is greater than", "is less than"],
	variants_title: ["is equal to", "is not equal to", "starts with", "ends with", "contains", "does not contain"],
};

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

	const getOperatorOptions = (condition) => {
		return operators[condition] || [];
	};

	const handleSearch = async () => {
		try {
			const response = await fetch(process.env.FILTER_BACKEND_URL, {
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
						<option value="">Select Operator</option>
						{Object.keys(operators).map((condition) => (
							<option key={condition} value={condition}>
								{condition}
							</option>
						))}
					</select>

					<label>Operator:</label>
					<select
						value={query.operator}
						onChange={(e) => handleQueryChange(index, "operator", e.target.value)}
					>
						<option value="">Select Operator</option>
						{getOperatorOptions(query.condition).map((operator) => (
							<option key={operator} value={operator}>
								{operator}
							</option>
						))}
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
