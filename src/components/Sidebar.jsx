import { NavLink } from 'react-router-dom';
import { FiGrid, FiPieChart, FiCalendar, FiMenu, FiX } from 'react-icons/fi';
import { useState, useEffect } from 'react';

const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile sidebar when route changes
  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className="mobile-nav-toggle glass-panel"
        onClick={toggleMobile}
      >
        {isMobileOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* Sidebar */}
      <aside className={`sidebar glass-panel ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <h2>Finance</h2>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsMobileOpen(false)}
          >
            <FiGrid />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/expenses"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsMobileOpen(false)}
          >
            <FiPieChart />
            <span>Expenses</span>
          </NavLink>

          <NavLink
            to="/calendar"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsMobileOpen(false)}
          >
            <FiCalendar />
            <span>Calendar</span>
          </NavLink>
        </nav>

        {/* User Profile / Footer Area can go here */}
      </aside>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="sidebar-overlay" onClick={() => setIsMobileOpen(false)} />
      )}
    </>
  );
};

export default Sidebar;
