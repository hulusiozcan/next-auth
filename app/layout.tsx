import "./globals.css";
import AuthProvider from "./providers";
import Header from "@/components/Header";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body>
        <Header/>
        <AuthProvider>{children}</AuthProvider>
        </body>
        </html>
    );
}