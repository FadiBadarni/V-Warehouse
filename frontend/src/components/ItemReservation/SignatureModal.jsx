import React from "react";
import SignaturePad from "react-signature-canvas";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { CircularProgress } from "@material-ui/core";

const SignatureModal = ({
  showModal,
  signaturePad,
  setSignaturePad,
  canSubmit,
  setCanSubmit,
  handleClear,
  handleSubmit,
  handleClose,
  isSubmitting,
}) => {
  const { t } = useTranslation("itemReservation");

  return (
    <motion.div
      className="signature-modal"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="signature-modal-content">
        <h3>{t("itemReservation.signatureTerms")}</h3>
        <p>{t("itemReservation.signatureText")}</p>
        <SignaturePad
          ref={(ref) => setSignaturePad(ref)}
          canvasProps={{ className: "signature-canvas" }}
          onEnd={() => setCanSubmit(!signaturePad.isEmpty())}
        />
        <div className="buttons-container">
          <button onClick={handleClear}>
            {t("itemReservation.clearButton")}
          </button>
          <button onClick={handleSubmit} disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? (
              <CircularProgress size={24} />
            ) : (
              t("itemReservation.submitButton")
            )}
          </button>
          <button onClick={handleClose}>
            {t("itemReservation.closeButton")}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default SignatureModal;
