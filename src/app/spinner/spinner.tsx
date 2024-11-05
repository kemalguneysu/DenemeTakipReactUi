"use client";
import React, { useState } from "react";
import { BeatLoader } from "react-spinners";
import { useTheme } from "next-themes";

const SpinnerComponent = () => {
  const { theme } = useTheme(); 
  const loaderColor = theme === "dark" ? "#FFFFFF" : "#000000";
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <BeatLoader size={15} color={loaderColor} />
    </div>
  );
};

export default SpinnerComponent;
