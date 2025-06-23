"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
    const { data: session, status } = useSession();

    return (
        <main className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
            <div className="max-w-xl w-full bg-white/80 rounded-lg shadow-lg px-8 py-12 flex flex-col items-center backdrop-blur">
                {/* Logo ve Slogan */}
                <div className="mb-6 flex flex-col items-center">
                    <span className="text-4xl font-bold text-primary mb-2">next-auth</span>
                    <span className="text-lg text-gray-600">OAuth & JWT ile Güvenli Giriş</span>
                </div>
                {/* CTA Butonları */}
                <div className="flex gap-4 mb-8">
                    {status === "loading" ? (
                        <span>Yükleniyor...</span>
                    ) : session?.user ? (
                        <>
                            <Button
                                variant="outline"
                                className="border border-primary text-primary px-6 py-2 rounded hover:bg-primary/10 transition"
                                onClick={() => signOut({ callbackUrl: "/" })}
                            >
                                Çıkış Yap
                            </Button>
                        </>
                    ) : (
                        <Link href="/login">
                            <Button className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/90 transition">
                                Giriş Yap
                            </Button>
                        </Link>
                    )}
                    <a
                        href="https://github.com/hulusiozcan/next-auth"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-primary text-primary px-6 py-2 rounded hover:bg-primary/10 transition"
                    >
                        GitHub’da İncele
                    </a>
                </div>
                {/* Özellikler */}
                <ul className="text-sm text-gray-500 flex flex-col gap-1 mb-4">
                    <li>✔️ Auth0 & OAuth Entegrasyonu</li>
                    <li>✔️ JWT ile oturum yönetimi</li>
                    <li>✔️ Rol bazlı yetkilendirme (admin, user)</li>
                    <li>✔️ SOLID & 12Factor prensipleri</li>
                </ul>
            </div>
        </main>
    );
}