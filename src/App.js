
import React, { useState } from "react";
import "./App.css"
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
					<input
						type="text"
						value={query.condition}
						onChange={(e) => handleQueryChange(index, "condition", e.target.value)}
					/>
					<label>Operator:</label>
					<input
						type="text"
						value={query.operator}
						onChange={(e) => handleQueryChange(index, "operator", e.target.value)}
					/>
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
