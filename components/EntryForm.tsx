// E:\programming\Project\eco-tracker\components\EntryForm.tsx

import React, { useState } from 'react';

interface EntryFormProps {
  type: 'product' | 'meal' | 'transport';
  onSubmit: (data: any) => void;
}

const EntryForm: React.FC<EntryFormProps> = ({ type, onSubmit }) => {
  const [name, setName] = useState('');
  const [co2Emission, setCo2Emission] = useState('');
  const [mode, setMode] = useState(''); // For transport only
  const [distance, setDistance] = useState(''); // For transport only

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      name,
      co2_emission: parseFloat(co2Emission),
      ...(type === 'transport' && { mode, distance: parseFloat(distance) })
    };

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input value={name} onChange={e => setName(e.target.value)} required />
      </div>

      <div>
        <label>CO2 Emission:</label>
        <input type="number" value={co2Emission} onChange={e => setCo2Emission(e.target.value)} required />
      </div>

      {type === 'transport' && (
        <>
          <div>
            <label>Mode:</label>
            <input value={mode} onChange={e => setMode(e.target.value)} required />
          </div>

          <div>
            <label>Distance (km):</label>
            <input type="number" value={distance} onChange={e => setDistance(e.target.value)} required />
          </div>
        </>
      )}

      <button type="submit">Save</button>
    </form>
  );
};

export default EntryForm;
