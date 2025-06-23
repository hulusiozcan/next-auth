import Link from "next/link";
import {Button} from "@/components/ui/button";

export default function AdminDashboardPage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
            <div className="bg-white/90 rounded-lg shadow-lg px-8 py-10 max-w-xl w-full">
                <h1 className="text-2xl font-bold mb-4 text-primary">
                    Admin Paneline Hoşgeldin
                </h1>
                <p className="text-muted-foreground mb-8">
                    Burası <b>süper gizli admin paneli</b>. Yalnızca admin yetkisine sahip kullanıcılar erişebilir!
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-primary/10 rounded p-4 flex flex-col items-center">
                        <span className="text-3xl font-bold text-primary">3</span>
                        <span className="text-xs mt-2 text-muted-foreground">Aktif Admin</span>
                    </div>
                    <div className="bg-green-100 rounded p-4 flex flex-col items-center">
                        <span className="text-3xl font-bold text-green-600">42</span>
                        <span className="text-xs mt-2 text-muted-foreground">Toplam Kullanıcı</span>
                    </div>
                    <div className="bg-yellow-100 rounded p-4 flex flex-col items-center">
                        <span className="text-3xl font-bold text-yellow-600">5</span>
                        <span className="text-xs mt-2 text-muted-foreground">Bugün Giren Admin</span>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
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