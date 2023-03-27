import React from "react";
import { useTranslation } from "react-i18next";
import images from "../../constants/images";
import Footer from "../Footer/Footer";
import "./Home.scss";

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="home">
      <header className="home__header">
        <div className="home__header-content">
          <div className="home__title">
            <div>{t("home.title")}</div>
            <p>{t("home.subtitle")}</p>
          </div>
          <div className="home__img">
            <img src={images.action} alt="" />
          </div>
        </div>
        <div className="home__subheader">
          <p className="home__subheader-subtitle">{t("home.browsetitle")}</p>
          <button className="home__subheader-button">{t("home.cta")}</button>
        </div>
      </header>

      <section className="features">
        <div className="features__content">
          <h2>{t("home.services")}</h2>
          <div className="features__grid">
            <div className="features__grid-item">
              <h3>{t("home.equipmentRentals")}</h3>
              <p>{t("home.equipmentRentalsDesc")}</p>
            </div>
            <div className="features__grid-item">
              <h3>{t("home.equipmentManagement")}</h3>
              <p>{t("home.equipmentManagementDesc")}</p>
            </div>
            <div className="features__grid-item">
              <h3>{t("home.procurement")}</h3>
              <p>{t("home.procurementDesc")}</p>
            </div>
          </div>
        </div>
      </section>
      <section className="equipment-catalog-section">
        <div className="equipment-catalog-content">
          <h2>{t("home.equipmentCatalog")}</h2>
          <div className="equipment-grid">
            <div className="equipment-item">
              <img src={images.audio} alt="Dummy Equipment 1" />
              <h3>{t("home.dummyEquipment")}</h3>
            </div>
            <div className="equipment-item">
              <img src={images.audio} alt="Dummy Equipment 2" />
              <h3>{t("home.dummyEquipment")}</h3>
            </div>
            <div className="equipment-item">
              <img src={images.audio} alt="Dummy Equipment 3" />
              <h3>{t("home.dummyEquipment")}</h3>
            </div>
            <div className="equipment-item">
              <img src={images.audio} alt="Dummy Equipment 4" />
              <h3>{t("home.dummyEquipment")}</h3>
            </div>
            <div className="equipment-item">
              <img src={images.audio} alt="Dummy Equipment 5" />
              <h3>{t("home.dummyEquipment")}</h3>
            </div>
          </div>
        </div>
      </section>
      <section className="help-support-section">
        <div className="help-support-content">
          <h2>{t("home.helpSupport")}</h2>
          <div className="help-support-flex">
            <div className="help-support-item">
              <h3>{t("home.faqs")}</h3>
              <p>{t("home.faqsDesc")}</p>
            </div>
            <div className="help-support-item">
              <h3>{t("home.userGuides")}</h3>
              <p>{t("home.userGuidesDesc")}</p>
            </div>
            <div className="help-support-item">
              <h3>{t("home.contactUs")}</h3>
              <p>{t("home.contactUsDesc")}</p>
            </div>
          </div>
        </div>
      </section>

      <Footer></Footer>
    </div>
  );
};

export default Home;
