import React from 'react';

const TrendCard = () => {
  return (
    <div className="card trend-card">
      <h2 className="card-title">Xu hướng bệnh (Tháng 4)</h2>
      <div className="chart-placeholder">
        <div className="chart-bar-group">
          <div className="chart-bar" style={{ height: '80%' }}><span>Viêm họng</span></div>
          <div className="chart-bar" style={{ height: '60%' }}><span>Sốt siêu vi</span></div>
          <div className="chart-bar" style={{ height: '40%' }}><span>Dị ứng</span></div>
          <div className="chart-bar" style={{ height: '25%' }}><span>Khác</span></div>
        </div>
      </div>
    </div>
  );
};
export default TrendCard;