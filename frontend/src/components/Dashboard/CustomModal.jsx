import React from "react";
import { motion } from "framer-motion";

const CustomModal = ({ showModal, handleClose, children }) => {
  if (!showModal) return null;

  return (
    <motion.div
      className="custom-modal"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="custom-modal-content">
        {children}
        <div className="buttons-container">
          <button onClick={handleClose}>Close</button>
        </div>
      </div>
    </motion.div>
  );
};
export default CustomModal;
