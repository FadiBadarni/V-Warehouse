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
        "The virtual warehouse is an online platform designed to manage equipment rentals, inventory tracking, and room bookings for the visual communication department. It provides a seamless and efficient system for students, lecturers, and warehouse managers to access and manage resources.",
    },
    {
      question: "How do I register for an account?",
      answer:
        "To register for an account, click on the Sign Up button on the website's homepage and provide the required personal information, including your name, email address, and a unique password. You'll receive a verification email to confirm your registration. Once verified, you can access the platform and its features.",
    },
    {
      question: "What equipment is available for rent?",
      answer:
        "The virtual warehouse offers a wide range of equipment for rent, including cameras, lighting equipment, audio gear, and other accessories necessary for visual communication projects. You can browse the equipment catalog to view available items and their specifications.",
    },
    {
      question: "How do I place an equipment rental request?",
      answer:
        "To rent equipment, log in to your account, browse the available items, and select the equipment you'd like to rent. Specify the intended start date, return date, quantity needed, and reason for borrowing. Review and agree to the terms and conditions before submitting your request. The warehouse manager will review your request and approve or reject it based on availability and eligibility.",
    },
    {
      question: "How are late returns handled?",
      answer:
        "Late returns are subject to the late return policy outlined in the terms and conditions. Users are responsible for returning equipment on time, and penalties may apply for late returns. Please review the late return policy for detailed information on penalties and procedures.",
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
