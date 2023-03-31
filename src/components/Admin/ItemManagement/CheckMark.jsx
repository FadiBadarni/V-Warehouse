import React from "react";
import { useSpring, animated } from "react-spring";

const CheckMark = ({ show }) => {
  const animationProps = useSpring({
    opacity: show ? 1 : 0,
    transform: show ? "scale(1)" : "scale(0)",
    config: { duration: 300 },
  });

  return (
    <animated.svg
      style={animationProps}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 52 52"
      width="52"
      height="52"
    >
      <circle
        cx="26"
        cy="26"
        r="25"
        fill="none"
        stroke="#0f0"
        strokeWidth="2"
      />
      <path
        fill="none"
        stroke="#0f0"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit="10"
        d="M14 27l7.8 7L38 18"
      />
    </animated.svg>
  );
};

export default CheckMark;
