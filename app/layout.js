import localFont from "next/font/local";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {CommitmentProvider} from "@/lib/store/CommitmentContext";
import {ThemeProvider} from "@/lib/store/ThemeContext";

const inter = localFont({
    src: "../fonts/Inter-VariableFont_opsz,wght.ttf",
    variable: "--font-inter",
    display: "swap",
});

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "Individual Progress",
    description: "Track your goals and build lasting habits",
};

export default function RootLayout({children}) {
    return (
        <html lang="en" className={`${inter.variable} ${geistSans.variable} ${geistMono.variable}`}>
        <body>
        <ThemeProvider>
        <CommitmentProvider>
            {children}
        </CommitmentProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}
