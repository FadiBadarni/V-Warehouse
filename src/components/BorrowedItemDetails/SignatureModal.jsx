import React from "react";
import SignaturePad from "react-signature-canvas";
import { motion } from "framer-motion";

const SignatureModal = ({
  showModal,
  signaturePad,
  setSignaturePad,
  canSubmit,
  setCanSubmit,
  handleClear,
  handleSubmit,
  handleClose,
}) => (
  <motion.div
    className="signature-modal"
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.5 }}
    transition={{ duration: 0.3 }}
  >
    <h3>Terms of Borrowing</h3>
    <p>
      By signing below, you agree to the terms and conditions of borrowing the
      item.
    </p>
    <SignaturePad
      ref={(ref) => setSignaturePad(ref)}
      canvasProps={{ className: "signature-canvas" }}
      onEnd={() => setCanSubmit(!signaturePad.isEmpty())}
    />
    <div className="buttons-container">
      <button onClick={handleClear}>Clear</button>
      <button onClick={handleSubmit} disabled={!canSubmit}>
        Submit
      </button>
      <button onClick={handleClose}>Close</button>
    </div>
  </motion.div>
);

export default SignatureModal;
