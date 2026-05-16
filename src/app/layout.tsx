import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ChatAssistant from "@/components/ChatAssistant";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IT Support Assistant | TechCorp AG",
  description: "IT Support Dashboard und KI-Assistent für TechCorp AG",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className={inter.className}>
        {children}
        <ChatAssistant />
      </body>
    </html>
  );
}
