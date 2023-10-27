// E:\programming\Project\eco-tracker\utils\useEntries.ts

import { useState, useEffect } from 'react';

const useEntries = (endpoint: string) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await fetch(endpoint);
        const data = await response.json();
        setEntries(data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchEntries();
  }, [endpoint]);

  return { entries, loading, error };
};

export default useEntries;
