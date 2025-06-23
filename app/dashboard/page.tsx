"use client";

import { useSession } from "next-auth/react";
import {Button} from "@/components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
    const { data: session } = useSession();

    return (
        <main className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
            <div className="bg-white/80 rounded-lg shadow-lg px-8 py-10 max-w-xl w-full">
                <h1 className="text-2xl font-bold mb-4">
                    Hoşgeldin{session?.user?.name ? `, ${session.user.name}` : "!"}
                </h1>
                <p className="text-muted-foreground mb-8">
                    Burası süper gizli dashboard! Burada uygulamanın özet bilgilerini görebilirsin.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-primary/10 rounded p-4 flex flex-col items-center">
                        <span className="text-3xl font-bold text-primary">12</span>
                        <span className="text-xs mt-2 text-muted-foreground">Aktif Kullanıcı</span>
                    </div>
                    <div className="bg-green-100 rounded p-4 flex flex-col items-center">
                        <span className="text-3xl font-bold text-green-600">7</span>
                        <span className="text-xs mt-2 text-muted-foreground">Admin Paneli Erişimi</span>
                    </div>
                    <div className="bg-yellow-100 rounded p-4 flex flex-col items-center">
                        <span className="text-3xl font-bold text-yellow-600">21</span>
                        <span className="text-xs mt-2 text-muted-foreground">Son 24 Saatte Giriş</span>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
                    <Link href="https://github.com/hulusiozcan/next-auth">
                        <Button className="flex-1 bg-primary text-white text-center py-3 rounded font-medium hover:bg-primary/90 transition">
                            GitHub Repo&#39;yu Görüntüle
                        </Button>
                    </Link>
                    <Link href="/">
                        <Button className="flex-1 bg-muted text-primary text-center py-3 rounded font-medium border border-primary/50 hover:bg-primary/10 transition">
                            Ana Sayfaya Dön
                        </Button>
                    </Link>
                </div>
            </div>
        </main>
    );
}