export default function LoginPage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
            <div className="bg-white/80 rounded-lg shadow-lg px-8 py-10 max-w-md w-full flex flex-col items-center backdrop-blur">
                {/* Logo veya App İsmi */}
                <div className="mb-6">
                    <span className="text-3xl font-bold text-primary">next-auth</span>
                </div>
                {/* Hoşgeldiniz Mesajı */}
                <h1 className="text-2xl font-semibold mb-2">Hoşgeldiniz!</h1>
                <p className="text-muted-foreground text-center mb-6">
                    Uygulamamıza güvenli giriş yapın.
                </p>
                {/* Giriş Butonları */}
                <div className="flex flex-col gap-4 w-full mb-6">
                </div>
                {/* Genel bilgiler */}
                <p className="text-xs text-center text-gray-500 mb-2">
                    Default user girişi ile user bölümüne ulaşabilirsiniz.
                </p>
                <p className="text-xs text-center text-gray-500 mb-2">
                    Eğer bir admin hesabı ile giriş yaparsanız admin sayfasına da ulaşabilirsiniz.
                </p>
            </div>
        </main>
    );
}