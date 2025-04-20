// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Keep this for global styles (including Tailwind)
import Navbar from "@/components/Navbar"; // Import Navbar (using the @ alias)
import Footer from "@/components/Footer"; // Import Footer
import { AuthProvider } from "@/context/AuthContext"; // Import AuthProvider

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Examind - A/L Learning Platform", // Set a default title
  description: "Gamified AI Learning Platform for Sri Lankan A/L Students",
  icons: {
  icon: '/favicon.png',
  apple: '/apple-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}> {/* Flex layout for sticky footer */}
        <AuthProvider> {/* Wrap everything inside AuthProvider */}
          <Navbar /> {/* Add the Navbar here */}
          <main className="flex-grow container mx-auto px-4 py-8"> {/* Main content area */}
            {children} {/* Page content will be rendered here */}
          </main>
          <Footer /> {/* Add the Footer here */}
        </AuthProvider> 
      </body>
    </html>
  );
}