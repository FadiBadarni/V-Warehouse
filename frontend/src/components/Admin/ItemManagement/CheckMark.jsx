import React from "react";
import { useSpring, animated } from "react-spring";

const CheckMark = ({ show }) => {
  const animationProps = useSpring({
    opacity: show ? 1 : 0,
    transform: show ? "scale(1)" : "scale(0)",
    zIndex: show ? 9999 : -1,
    config: { duration: 300 },
  });

  const overlayAnimationProps = useSpring({
    opacity: show ? 0.5 : 0,
    zIndex: show ? 9998 : -1,
    config: { duration: 300 },
  });

  return (
    <>
      <animated.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "#000",
          ...overlayAnimationProps,
        }}
      />
      <animated.div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          ...animationProps,
        }}
      >
        <animated.svg
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
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeMiterlimit="10"
            d="M14 27l7.8 7L38 18"
          />
        </animated.svg>
      </animated.div>
    </>
  );
};

export default CheckMark;
