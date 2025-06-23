import Link from 'next/link';
import Image from 'next/image';
import { NavigationMenus } from "@/components/NavigationMenu";
import AuthButtons from "@/components/AuthButtons";
import AuthProvider from "../app/providers";

const Header = () => {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2">
            <div className="container mx-auto flex items-center justify-between px-4">
                {/* Sol: Logo ve Navigasyon */}
                <div className="flex items-center gap-4">
                    <Link href="/">
                        <Image
                            src="/authjslogo.png"
                            alt="next-auth-logo"
                            className="h-35 w-auto"
                            sizes="100vw"
                            height={0}
                            width={0}
                        />
                    </Link>
                </div>

                {/* Orta: Başlık ve açıklama */}
                <div className="flex flex-col items-center flex-1">
                    <h1 className="text-3xl font-bold">NextAuth ve Auth0 Demo</h1>
                    <NavigationMenus />
                </div>

                {/* Sağ: AuthButtons */}
                <div className="flex items-center justify-end min-w-[48px]">
                    <AuthProvider><AuthButtons /></AuthProvider>
                </div>
            </div>
        </header>
    );
};

export default Header;