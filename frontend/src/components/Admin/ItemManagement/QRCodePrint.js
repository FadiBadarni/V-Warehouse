import React, { useRef } from "react";
import ReactDOM from "react-dom";
import { Button } from "@mui/material";

const QRCodePrint = ({ generatedQRCodes, isPrintButtonDisabled }) => {
  const iframeRef = useRef();

  const printQRCodes = () => {
    const qrCodesContainer = document.createElement("div");
    qrCodesContainer.classList.add("qr-codes-print-container");

    const qrCodeWrapper = document.createElement("div");
    ReactDOM.render(generatedQRCodes, qrCodeWrapper);
    qrCodesContainer.appendChild(qrCodeWrapper);

    const printContent = `
      <html>
        <head>
          <title>Print QR Codes</title>
        </head>
        <body>
          <h1>QR Codes</h1>
          ${qrCodesContainer.innerHTML}
        </body>
      </html>
    `;

    const iframeDoc = iframeRef.current.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(printContent);
    iframeDoc.close();

    iframeRef.current.contentWindow.focus();
    iframeRef.current.contentWindow.print();
  };

  return (
    <div className="equipment-management__qr-codes">
      <Button
        variant="contained"
        color="primary"
        fullWidth
        className="print-button"
        onClick={printQRCodes}
        disabled={isPrintButtonDisabled}>
        Print QR Codes
      </Button>
      <iframe
        ref={iframeRef}
        title="print-iframe"
        style={{ display: "none" }}></iframe>
    </div>
  );
};

export default QRCodePrint;
