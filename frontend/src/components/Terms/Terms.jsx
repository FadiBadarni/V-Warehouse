import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import "./Terms.scss";

const Terms = () => {
  const terms = [
    {
      title: "1. General Terms",
      content:
        "By accessing and using this platform, you accept and agree to be bound by the terms and conditions contained herein. The platform reserves the right to modify these terms and conditions without prior notice.",
    },
    {
      title: "2. Account Registration",
      content:
        "You must register for an account on this platform to access its services. By registering, you agree to provide accurate, current, and complete information about yourself.",
    },
    {
      title: "3. Equipment Rental",
      content:
        "Equipment rentals are subject to availability and approval by the warehouse manager. You are responsible for the equipment from the time of rental until it is returned. You must return the equipment in the same condition as when it was rented, or you may be held liable for the cost of repair or replacement.",
    },
    {
      title: "4. Late Returns",
      content:
        "Late returns are subject to penalties as outlined in our Late Return Policy. You are responsible for returning equipment on time and may be charged additional fees for late returns.",
    },
    {
      title: "5. Liability",
      content:
        "The platform is not liable for any damages or losses resulting from the use of its services, including the rental of equipment. You agree to indemnify and hold harmless the platform and its affiliates from any claims, damages, or losses resulting from your use of the platform.",
    },
  ];

  return (
    <Box className="terms">
      <Typography className="terms__title" variant="h3">
        Terms and Conditions
      </Typography>
      <Box className="terms__content">
        {terms.map((term, index) => (
          <Box className="terms__item" key={index}>
            <Typography className="terms__item-title" variant="h5">
              {term.title}
            </Typography>
            <Typography className="terms__item-content">
              {term.content}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Terms;
