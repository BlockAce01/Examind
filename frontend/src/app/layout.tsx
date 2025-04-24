import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Examind - A/L Learning Platform",
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
      <body className={`${inter.className} flex flex-col min-h-screen`}> {
        }
        <AuthProvider> {
      }
          <Navbar /> {
        }
          <main className="flex-grow container mx-auto px-4 py-8"> {
        }
            {children} {
            }
          </main>
          <Footer /> {
        }
        </AuthProvider> 
      </body>
    </html>
  );
}