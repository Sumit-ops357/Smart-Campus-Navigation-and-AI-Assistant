import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import mainBuilding from '../../assets/main_building.jpg';
import csBuilding from '../../assets/cs_building.jpg';
import electricalBuilding from '../../assets/electrical_building.jpg';
import mechanicalBuilding from '../../assets/mechanical_building.jpg';
import electronicsBuilding from '../../assets/electronics_building.jpg';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="logo">Smart Campus Navigator</div>
        <div className="nav-links">
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/register" className="nav-link btn-primary">Sign Up</Link>
        </div>
      </nav>

      <header className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Navigate Your Campus <br /> Like a <span className="highlight">Pro</span></h1>
          <p className="hero-subtitle">
            Experience the future of campus navigation. Find classrooms, labs, and amenities with our AI-powered interactive map.
          </p>
          <div className="hero-cta">
            <Link to="/map" className="btn-large">Get Started</Link>
            <a href="#features" className="btn-outline">Learn More</a>
          </div>
        </div>
      </header>

      <section id="features" className="features-section">
        <h2 className="section-title">Campus Highlights</h2>
        <div className="features-grid">
          <div className="feature-card">
            <img src={mainBuilding} alt="Main Building" />
            <div className="card-content">
              <h3>Main Building</h3>
              <p>The heart of our campus, housing administration and central library.</p>
            </div>
          </div>
          <div className="feature-card">
            <img src={csBuilding} alt="Computer Science Block" />
            <div className="card-content">
              <h3>Computer Science</h3>
              <p>State-of-the-art labs and innovation centers for future tech leaders.</p>
            </div>
          </div>
          <div className="feature-card">
            <img src={electricalBuilding} alt="Electrical Engineering" />
            <div className="card-content">
              <h3>Electrical Dept</h3>
              <p>Powering the future with advanced research facilities.</p>
            </div>
          </div>
          <div className="feature-card">
            <img src={mechanicalBuilding} alt="Mechanical Engineering" />
            <div className="card-content">
              <h3>Mechanical Dept</h3>
              <p>Where engineering meets creativity and design.</p>
            </div>
          </div>
          <div className="feature-card">
            <img src={electronicsBuilding} alt="Electronics Block" />
            <div className="card-content">
              <h3>Electronics Dept</h3>
              <p>Cutting-edge technology and communication systems.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <p>&copy; 2025 Smart Campus Navigator. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
