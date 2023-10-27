// E:\programming\Project\eco-tracker\pages\analysis.tsx

import React from 'react';
import useEntries from '../utils/useEntries';
import CO2EmissionChart from '../components/CO2EmissionChart';

const AnalysisPage: React.FC = () => {
  const { entries: productEntries } = useEntries('/api/products');
  const { entries: mealEntries } = useEntries('/api/meals');
  const { entries: transportEntries } = useEntries('/api/transports');

  return (
    <div className="container mt-5">
      <h2 className="mb-4">CO2排出量の分析結果</h2>

      <div className="mb-4">
        <h3 className="mb-3">製品</h3>
        <CO2EmissionChart data={productEntries} title="製品のCO2排出量" />
      </div>

      <div className="mb-4">
        <h3 className="mb-3">食事</h3>
        <CO2EmissionChart data={mealEntries} title="食事のCO2排出量" />
      </div>

      <div className="mb-4">
        <h3 className="mb-3">輸送</h3>
        <CO2EmissionChart data={transportEntries} title="輸送のCO2排出量" />
      </div>
    </div>
  );
};

export default AnalysisPage;
