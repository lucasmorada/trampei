"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";

export function AppProviders({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            className: "dark:bg-zinc-800 dark:text-white",
            duration: 4000,
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}
