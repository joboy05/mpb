import React from 'react';

const DashboardStats = ({ memberStats }) => {
  if (!memberStats) return null;

  return (
    <div className="flex flex-wrap gap-4">
      <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
        <div className="text-sm opacity-90">Engagements</div>
        <div className="text-2xl font-bold">{memberStats.totalEngagements || 0}</div>
      </div>
      <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
        <div className="text-sm opacity-90">Événements</div>
        <div className="text-2xl font-bold">{memberStats.eventsAttended || 0}</div>
      </div>
      <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
        <div className="text-sm opacity-90">Membre depuis</div>
        <div className="text-lg font-bold">{new Date(memberStats.joinDate).getFullYear()}</div>
      </div>
    </div>
  );
};

export default DashboardStats;