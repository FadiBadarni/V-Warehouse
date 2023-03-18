import React from "react";
import images from "../../constants/images";
import Footer from "../Footer/Footer";
import "./Home.scss";

const Home = () => {
  return (
    <div className="home-container">
      <header>
        <div className="header-content">
          <div className="home-title">
            <div>
              Lights, Camera, <span>Action</span> !
            </div>
            <br />

            <p>
              The Virtual Warehouse for{" "}
              <u style={{ fontWeight: "bold" }}> Visual Mavericks</u>.
            </p>
          </div>
          <div className="action-img">
            <img src={images.action} alt="" />
          </div>
          <p className="home-subtitle">
            The ultimate resource for equipment rentals and management, designed
            for the visual communication Department.
          </p>

          <button className="home-cta">Browse Equipment</button>
        </div>
      </header>
      <section className="features-section">
        <div className="features-bg"></div>
        <div className="features-content">
          <h2>Our Services</h2>
          <div className="features-grid">
            <div className="feature">
              <h3>Equipment Rentals</h3>
              <p>
                From cameras to podcast rooms, we have everything you need to
                bring your visual communication projects to life.
              </p>
            </div>
            <div className="feature">
              <h3>Equipment Management</h3>
              <p>
                Our system allows you to track and manage equipment usage,
                repairs, and inventory with ease.
              </p>
            </div>
            <div className="feature">
              <h3>Procurement</h3>
              <p>
                Need to order new equipment or request repairs? Our procurement
                system has got you covered.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="equipment-catalog-section">
        <div className="equipment-catalog-content">
          <h2>Equipment Catalog</h2>
          <div className="equipment-grid">
            <div className="equipment-item">
              <img src={images.audio} alt="Dummy Equipment 1" />
              <h3>Dummy Equipment 1</h3>
            </div>
            <div className="equipment-item">
              <img src={images.audio} alt="Dummy Equipment 2" />
              <h3>Dummy Equipment 2</h3>
            </div>
            <div className="equipment-item">
              <img src={images.audio} alt="Dummy Equipment 3" />
              <h3>Dummy Equipment 2</h3>
            </div>
            <div className="equipment-item">
              <img src={images.audio} alt="Dummy Equipment 4" />
              <h3>Dummy Equipment 3</h3>
            </div>
            <div className="equipment-item">
              <img src={images.audio} alt="Dummy Equipment 5" />
              <h3>Dummy Equipment 2</h3>
            </div>
          </div>
        </div>
      </section>
      <section className="help-support-section">
        <div className="help-support-content">
          <h2>Help and Support</h2>
          <div className="help-support-flex">
            <div className="help-support-item">
              <h3>FAQs</h3>
              <p>
                Find answers to the most frequently asked questions about using
                the virtual warehouse system.
              </p>
            </div>
            <div className="help-support-item">
              <h3>User Guides</h3>
              <p>
                Access step-by-step guides for getting started with the
                platform, managing equipment, and more.
              </p>
            </div>
            <div className="help-support-item">
              <h3>Contact Us</h3>
              <p>
                Need assistance? Get in touch with our support team for help
                with any issues or inquiries.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer></Footer>
    </div>
  );
};

export default Home;
