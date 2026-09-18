import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import LenisProvider from "@/components/providers/LenisProvider";

export const metadata: Metadata = {
  title: "RITHMOS — Where Bands Rise | Live Music Competition, Hyderabad",
  description:
    "RITHMOS is Hyderabad's premier live band competition — a cinematic, multi-stage journey from rehearsal room to iconic stage. Every band has a story. Every story needs a stage.",
  keywords: "RITHMOS, live music, band competition, Hyderabad, rock bands, music festival, India",
  openGraph: {
    title: "RITHMOS — Where Bands Rise",
    description: "Hyderabad's premier live band competition. Every Band Has a Story. Every Story Needs a Stage.",
    type: "website",
  },
};

import CustomCursor from "@/components/ui/CustomCursor";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="grain">
      <body>
        <CustomCursor />
        <LenisProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </LenisProvider>
      </body>
    </html>
  );
}
