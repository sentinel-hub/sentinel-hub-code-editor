import React from "react";
import "./ThemeDark";
import "./ThemeLight";
export default function ThemeProvider({ theme, children }) {
  return (
    <div className={theme === "light" ? "theme-light" : "theme-dark"}>
      {children}
    </div>
  );
}
