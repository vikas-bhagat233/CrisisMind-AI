import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { AnalysisProvider } from "./context/AnalysisContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AnalysisProvider>
          <AppRoutes />
        </AnalysisProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
