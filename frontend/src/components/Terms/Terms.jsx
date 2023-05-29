import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";

import "./Terms.scss";

const Terms = () => {
  const { t } = useTranslation("terms");
  const terms = [
    {
      title: t("terms.generalTermsTitle"),
      content: t("terms.generalTermsContent"),
    },
    {
      title: t("terms.accountRegistrationTitle"),
      content: t("terms.accountRegistrationContent"),
    },
    {
      title: t("terms.equipmentRentalTitle"),
      content: t("terms.equipmentRentalContent"),
    },
    {
      title: t("terms.lateReturnsTitle"),
      content: t("terms.lateReturnsContent"),
    },
    {
      title: t("terms.liabilityTitle"),
      content: t("terms.liabilityContent"),
    },
  ];

  return (
    <Box className="terms">
      <Typography className="terms__title" variant="h3">
        {t("terms.title")}
      </Typography>
      <Box className="terms__content">
        {terms.map((term, index) => (
          <Box className="terms__item" key={index}>
            <Typography className="terms__item-title" variant="h5">
              {t(term.title)}
            </Typography>
            <Typography className="terms__item-content">
              {t(term.content)}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Terms;
