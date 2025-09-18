import React from 'react';
import { Outlet } from 'react-router-dom';

const App = () => {
  return (
    <div>
      {/* You can add a header, nav, etc. here */}
      <Outlet />
      {/* You can add a footer, etc. here */}
    </div>
  );
};

export default App;
