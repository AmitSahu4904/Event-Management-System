import React from 'react';
import { Outlet } from 'react-router-dom';

export const PublicLayout = () => {
  return (
    <div className="public-layout-wrapper">
      <Outlet />
    </div>
  );
};
