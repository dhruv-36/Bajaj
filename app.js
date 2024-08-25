import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [response, setResponse] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = "Your Roll Number"; // Replace with actual roll number
  }, []);

  const handleInputChange = (e) => {
    setJsonInput(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { value, checked } = e.target;
    setSelectedFilters((prevFilters) =>
      checked ? [...prevFilters, value] : prevFilters.filter((f) => f !== value)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const parsedInput = JSON.parse(jsonInput);
      const response = await fetch('http://localhost:5000/process', { // Replace with your API endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedInput),
      });
      const result = await response.json();
      filterAndSetResponse(result);
    } catch (err) {
      setError('Invalid JSON format');
    }
  };

  const filterAndSetResponse = (data) => {
    let filteredResponse = data.data;
    if (selectedFilters.includes('Numbers')) {
      filteredResponse = filteredResponse.filter((item) => !isNaN(item));
    }
    if (selectedFilters.includes('Alphabets')) {
      filteredResponse = filteredResponse.filter((item) => /^[A-Za-z]+$/.test(item));
    }
    if (selectedFilters.includes('Highest lowercase alphabet')) {
      const highestLowercase = Math.max(...filteredResponse.filter((item) => /^[a-z]$/.test(item)).map((item) => item.charCodeAt(0)));
      filteredResponse = filteredResponse.filter((item) => item.charCodeAt(0) === highestLowercase);
    }
    setResponse(filteredResponse.join(', '));
  };

  return (
    <div className="container">
      <h1>Your Roll Number</h1>
      <form onSubmit={handleSubmit}>
        <label>
          API Input:
          <input type="text" value={jsonInput} onChange={handleInputChange} />
        </label>
        <button type="submit">Submit</button>
        {error && <p className="error">{error}</p>}
      </form>
      <div className="filters">
        <h2>Multi-Select Filter</h2>
        <label>
          <input type="checkbox" value="Numbers" onChange={handleFilterChange} />
          Numbers
        </label>
        <label>
          <input type="checkbox" value="Alphabets" onChange={handleFilterChange} />
          Alphabets
        </label>
        <label>
          <input type="checkbox" value="Highest lowercase alphabet" onChange={handleFilterChange} />
          Highest lowercase alphabet
        </label>
      </div>
      <div className="response">
        <h2>Filtered Response</h2>
        <p>{response}</p>
      </div>
    </div>
  );
}

export default App;
