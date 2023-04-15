// Faqs.jsx
import React from "react";
import { motion } from "framer-motion";
import { useSpring, animated } from "react-spring";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./Faqs.scss";

const FAQs = () => {
  const fade = useSpring({ opacity: 1, from: { opacity: 0 } });

  const faqs = [
    {
      question: "What is the main purpose of your project?",
      answer:
        "Our project aims to provide a seamless experience to users by offering a comprehensive platform for managing tasks, events, and deadlines.",
    },
    {
      question: "How do I get started with your project?",
      answer:
        "Simply sign up for an account, and you'll be guided through the process of setting up your dashboard and creating tasks or events.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Yes, we take data security very seriously. We employ industry-standard encryption and security measures to protect your information.",
    },
    {
      question: "Can I use the platform on multiple devices?",
      answer:
        "Yes, our platform is designed to work seamlessly across various devices, including desktops, laptops, tablets, and smartphones.",
    },
  ];

  const accordionVariants = {
    open: { opacity: 1, height: "auto" },
    closed: { opacity: 0, height: 0 },
  };

  return (
    <animated.div style={fade} className="faqs">
      <Typography className="faqs__title" variant="h3">
        Frequently Asked Questions
      </Typography>
      <Box className="faqs__content">
        {faqs.map((faq, index) => (
          <motion.div className="faqs__item" key={index}>
            <Accordion>
              <AccordionSummary
                className="faqs__summary"
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`faq-content-${index}`}
                id={`faq-summary-${index}`}
              >
                <Typography className="faqs__question" variant="h5">
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <motion.div
                  className="faqs__answer"
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={accordionVariants}
                >
                  <Typography>{faq.answer}</Typography>
                </motion.div>
              </AccordionDetails>
            </Accordion>
          </motion.div>
        ))}
      </Box>
      <Box className="faqs__additional-info">
        <Typography className="faqs__additional-title" variant="h4">
          Need more help?
        </Typography>
        <Typography className="faqs__additional-text">
          If you have any further questions or need assistance, please don't
          hesitate to{" "}
          <a href="/contact" className="faqs__contact-link">
            contact us
          </a>
          .
        </Typography>
      </Box>
    </animated.div>
  );
};

export default FAQs;
