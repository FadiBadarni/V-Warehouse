import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import images from "../../constants/images";
import Footer from "../Footer/Footer";
import { Link } from "react-router-dom";
import "./Home.scss";
import FeatureCard from "./FeatureCard";
import { AnimatePresence } from "framer-motion";
import ThreeDotsWave from "./three-dots-wave";
import { motion } from "framer-motion";
import { Grid } from "@mui/material";

const Home = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="home">
      <AnimatePresence>{loading && <ThreeDotsWave />}</AnimatePresence>
      {!loading && (
        <>
          <div className="home">
            <header className="home__header">
              <div className="home__header-bg"></div>
              <div className="home__header-camera-frame top-left"></div>
              <div className="home__header-camera-frame top-right">
                <div className="home__header-recording-dot"></div>
              </div>

              <div className="home__header-content">
                <div className="home__title">
                  <div>{t("home.title")}</div>
                  <p>{t("home.subtitle")}</p>
                </div>
              </div>
              <div className="home__subheader">
                <p className="home__subheader-subtitle">
                  {t("home.browsetitle")}
                </p>
                <button className="home__subheader-button">
                  <span>{t("home.cta")}</span>
                </button>
              </div>
            </header>

            <section className="features">
              <div className="features__content">
                <div className="features__title">
                  <span>{t("home.services")}</span>
                </div>
                <div className="features__grid">
                  <FeatureCard
                    title={t("home.equipmentRentals")}
                    description={t("home.equipmentRentalsDesc")}
                  />
                  <FeatureCard
                    title={t("home.equipmentManagement")}
                    description={t("home.equipmentManagementDesc")}
                  />
                  <FeatureCard
                    title={t("home.procurement")}
                    description={t("home.procurementDesc")}
                  />
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
                <Grid container spacing={3} justifyContent="center">
                  <Grid item xs={12} sm={6} md={4}>
                    <Link key={t("home.faqs")} to={`/FAQS`}>
                      <motion.div
                        className="help-support-item"
                        whileHover={{ y: -10 }}
                      >
                        <h3>{t("home.faqs")}</h3>
                        <p>{t("home.faqsDesc")}</p>
                      </motion.div>
                    </Link>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Link key={t("home.userGuides")} to={`/Help`}>
                      <motion.div
                        className="help-support-item"
                        whileHover={{ y: -10 }}
                      >
                        <h3>{t("home.userGuides")}</h3>
                        <p>{t("home.userGuidesDesc")}</p>
                      </motion.div>
                    </Link>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Link key={t("home.contactUs")} to={`/Contact`}>
                      <motion.div
                        className="help-support-item"
                        whileHover={{ y: -10 }}
                      >
                        <h3>{t("home.contactUs")}</h3>
                        <p>{t("home.contactUsDesc")}</p>
                      </motion.div>
                    </Link>
                  </Grid>
                </Grid>
              </div>
            </section>

            <Footer></Footer>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
