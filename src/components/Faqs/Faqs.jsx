import React from "react";
import { motion } from "framer-motion";
import { useSpring, animated } from "react-spring";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import "./Faqs.scss";

const FAQs = () => {
  const fade = useSpring({ opacity: 1, from: { opacity: 0 } });

  const faqs = [
    {
      question: "Question 1?",
      answer: "Answer 1",
    },
    {
      question: "Question 2?",
      answer: "Answer 2",
    },
  ];

  return (
    <animated.div style={fade} className="faqs">
      <Typography className="faqs__title" variant="h2">
        Frequently Asked Questions
      </Typography>
      <Box className="faqs__content">
        {faqs.map((faq, index) => (
          <motion.div
            className="faqs__item"
            key={index}
            whileHover={{ y: -10 }}
          >
            <Typography className="faqs__question" variant="h5">
              {faq.question}
            </Typography>
            <Typography className="faqs__answer">{faq.answer}</Typography>
          </motion.div>
        ))}
      </Box>
    </animated.div>
  );
};

export default FAQs;
