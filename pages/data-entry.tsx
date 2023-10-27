// E:\programming\Project\eco-tracker\pages\data-entry.tsx

import React from 'react';
import EntryForm from '../components/EntryForm';

const DataEntryPage: React.FC = () => {
  const handleSubmit = async (type: string, data: any) => {
    try {
      const response = await fetch(`/api/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        alert('Data saved successfully!');
      } else {
        const errorData = await response.json();
        alert(errorData.message);
      }
    } catch (error) {
      alert('Error saving data. Please try again later.');
    }
  };

  return (
    <div className="container">
      <h2>Data Entry</h2>

      <div>
        <h3>Product</h3>
        <EntryForm type="product" onSubmit={data => handleSubmit('products', data)} />
      </div>

      <div>
        <h3>Meal</h3>
        <EntryForm type="meal" onSubmit={data => handleSubmit('meals', data)} />
      </div>

      <div>
        <h3>Transport</h3>
        <EntryForm type="transport" onSubmit={data => handleSubmit('transports', data)} />
      </div>
    </div>
  );
};

export default DataEntryPage;
