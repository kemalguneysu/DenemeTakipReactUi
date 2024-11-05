"use client";
import React from "react";
import { BeatLoader } from "react-spinners";
import { useTheme } from "next-themes";

const SpinnerMethodComponent = () => {
  const { theme } = useTheme(); // Get the current theme
  const loaderColor = theme === "dark" ? "#FFFFFF" : "#000000"; // Set loader color based on theme
  const backgroundColor =
    theme === "dark" ? "rgba(0, 0, 0, 0.5)" : "rgba(255, 255, 255, 0.5)"; // Background color

  return (
    <div
      className="flex justify-center items-center"
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        backgroundColor: backgroundColor, // Optional background
        zIndex: 1000, // Ensure it appears on top
      }}
    >
      <BeatLoader size={15} color={loaderColor} />
    </div>
  );
};

export default SpinnerMethodComponent;
