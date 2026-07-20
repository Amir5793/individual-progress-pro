import localFont from "next/font/local";
import {Geist, Geist_Mono} from "next/font/google";
import Script from "next/script";
import "./globals.css";
import {CommitmentProvider} from "@/lib/store/CommitmentContext";
import {ThemeProvider} from "@/lib/store/ThemeContext";
import {LocaleProvider} from "@/lib/i18n/localeContext";

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
    manifest: "/individual-progress-pro/manifest.json",
    icons: {
        icon: [
            { url: "/individual-progress-pro/favicon.png", sizes: "32x32", type: "image/png" },
            { url: "/individual-progress-pro/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
            { url: "/individual-progress-pro/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
        ],
        apple: [
            { url: "/individual-progress-pro/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
        ],
    },
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        title: "Individual Progress",
    },
    other: {
        "theme-color": "#0c0a09",
        "mobile-web-app-capable": "yes",
    },
};

export default function RootLayout({children}) {
    return (
        <html lang="en" className={`${inter.variable} ${geistSans.variable} ${geistMono.variable}`}>
        <body>
        <ThemeProvider>
        <LocaleProvider>
        <CommitmentProvider>
            {children}
        </CommitmentProvider>
        </LocaleProvider>
        </ThemeProvider>
        <Script
            id="sw-register"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
                __html: `
                    if ('serviceWorker' in navigator) {
                        window.addEventListener('load', function() {
                            navigator.serviceWorker.register('/individual-progress-pro/sw.js');
                        });
                    }
                `,
            }}
        />
        </body>
        </html>
    );
}
