import React from "react";
import { motion } from "framer-motion";

const SignatureBackdrop = ({ handleClose }) => (
  <motion.div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.5)",
      zIndex: 999,
    }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
    onClick={handleClose}
  ></motion.div>
);

export default SignatureBackdrop;
