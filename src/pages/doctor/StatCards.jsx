import React from 'react';

const StatCards = ({ appointmentsCount }) => {
  return (
    <>
      <div className="card stat-card blue">
        <div className="card-icon"> 👥 </div>
        <div className="stat-info"><span className="stat-label">Tổng bệnh nhân</span><span className="stat-value">1,250</span></div>
        <span className="stat-change positive">+2% tháng này</span>
      </div>
      <div className="card stat-card teal">
        <div className="card-icon"> 📅 </div>
        <div className="stat-info"><span className="stat-label">Lịch hẹn hôm nay</span><span className="stat-value">{appointmentsCount}</span></div>
        <span className="stat-change">4 ca đã xong</span>
      </div>
    </>
  );
};
export default StatCards;