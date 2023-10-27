import React from 'react';
import useEntries from '../utils/useEntries';
import CO2EmissionChart from '../components/CO2EmissionChart';

const Dashboard: React.FC = () => {
  const { entries: productEntries } = useEntries('/api/products');
  const { entries: mealEntries } = useEntries('/api/meals');
  const { entries: transportEntries } = useEntries('/api/transports');

  return (
    <div className="container mt-5">
      <h2>ダッシュボード</h2>
      <div>
        <h3>製品</h3>
        {/* ここでproductEntriesを使用して製品のエントリをリスト表示します */}
        <CO2EmissionChart data={productEntries} title="製品のCO2排出量" />
      </div>
      <div>
        <h3>食事</h3>
        {/* ここでmealEntriesを使用して食事のエントリをリスト表示します */}
        <CO2EmissionChart data={mealEntries} title="食事のCO2排出量" />
      </div>
      <div>
        <h3>輸送</h3>
        {/* ここでtransportEntriesを使用して輸送のエントリをリスト表示します */}
        <CO2EmissionChart data={transportEntries} title="輸送のCO2排出量" />
      </div>
    </div>
  );
};

export default Dashboard;
