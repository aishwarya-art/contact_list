import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css"; // Import your CSS styles

function Dashboard() {
 
  const [activeNavItem, setActiveNavItem] = useState("home");

  const handleNavItemClick = (navItem) => {
    setActiveNavItem(navItem);
  };
  const confirmLogout = (event) => {
    const isConfirmed = window.confirm('Are you sure you want to logout?');
  
    if (!isConfirmed) {
      event.preventDefault();
    }
  };
  return (
    <div className="dashboard">
      {/* Sidebar Navigation */}
      <nav className="sidebar-navigation">
        <ul>
          {/* <li className={activeNavItem === "dashboard" ? "active" : ""}>
            <Link to="/dashboard" onClick={() => handleNavItemClick("dashboard")}>
              <i className="fa fa-share-alt"></i>
              <span className="tooltip">Dashboard</span>
            </Link>
          </li> */}
          <li className={activeNavItem === "home" ? "active" : ""}>
            <Link to="/" onClick={() => handleNavItemClick("home")}>
              <i className="fa fa-hdd-o"></i>
              <span className="tooltip">Users</span>
            </Link>
          </li>
          <li className={activeNavItem === "add" ? "active" : ""}>
          <Link to="/add" onClick={() => handleNavItemClick("add")}>
            <i className="fa fa-newspaper-o"></i>
            <span className="tooltip">Add user</span>
            </Link>
          </li>
          
          {/* <li>
            <i className="fa fa-print"></i>
            <span className="tooltip">Fax</span>
          </li> */}
          <li>
            <Link to="/" onClick={(e) => confirmLogout(e)}>
              {/* <i className="fa fa-sliders"></i> */}
              <i class="fa fa-sign-out "></i>
              <span className="tooltip">Logout</span>
            </Link>
          </li>
          <li></li>
          <li>
          <h4>CONTACT LIST APP </h4>
          </li>
        </ul>
       
      </nav>
     
     
      <main className="content">
     
      </main>
    </div>
  );
}

export default Dashboard;
