import { NavLink } from 'react-router-dom';
import { FiLayout, FiDollarSign, FiCalendar } from 'react-icons/fi';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Expense Tracker</h2>
      </div>
      <nav className="sidebar-nav">
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => 
            `nav-link ${isActive ? 'active' : ''}`
          }
        >
          <FiLayout />
          <span>Dashboard</span>
        </NavLink>
        <NavLink 
          to="/expenses" 
          className={({ isActive }) => 
            `nav-link ${isActive ? 'active' : ''}`
          }
        >
          <FiDollarSign />
          <span>Expenses</span>
        </NavLink>
        <NavLink 
          to="/calendar" 
          className={({ isActive }) => 
            `nav-link ${isActive ? 'active' : ''}`
          }
        >
          <FiCalendar />
          <span>Calendar</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;

