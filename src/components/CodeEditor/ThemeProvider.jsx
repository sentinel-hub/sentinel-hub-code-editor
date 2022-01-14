import React from "react";
import { Suspense } from "react";
const ThemeLight = React.lazy(() => import("./ThemeLight"));
const ThemeDark = React.lazy(() => import("./ThemeDark"));
export default function ThemeProvider({ theme, children }) {
  return (
    <Suspense fallback={() => null}>
      {theme === "light" && <ThemeLight />}
      {theme === "dark" && <ThemeDark />}
      {children}
    </Suspense>
  );
}
