import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const LatePolicy = () => {
  const { t } = useTranslation("itemReservation");
  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  return (
    <motion.div
      className="late-policy"
      initial="initial"
      animate="animate"
      transition="transition"
      variants={fadeIn}
    >
      <h3>{t("itemReservation.policyTitle")}</h3>
      <p>{t("itemReservation.policy")}</p>
    </motion.div>
  );
};

export default LatePolicy;
