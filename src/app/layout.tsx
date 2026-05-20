import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { GymProvider } from "@/components/GymProvider";
import { getGymSettings } from "@/lib/actions/settings";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getGymSettings();
  return {
    title: `${settings.gymName} — Gym Management`,
    description: settings.tagline,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getGymSettings();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#0a0a0a] text-zinc-100">
        <GymProvider
          config={{
            gymName: settings.gymName,
            tagline: settings.tagline,
            currency: settings.currency,
            phone: settings.phone,
            email: settings.email,
            address: settings.address,
          }}
        >
          <Sidebar
            gymName={settings.gymName}
            tagline={settings.tagline}
            footerNote={settings.footerNote}
          />
          <div className="ml-64 min-h-screen">
            <main className="p-8">
              <TopBar />
              {children}
            </main>
          </div>
        </GymProvider>
      </body>
    </html>
  );
}
