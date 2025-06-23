"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AuthButtons() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <p>Yükleniyor...</p>;
    }

    if (session && session.user) {
        return (
            <div>
                <div className="flex items-center gap-3 w-full">
                    <Avatar className="w-12 h-12">
                        <AvatarImage
                            src={session.user.image ?? undefined}
                            alt={session.user.name ?? "Avatar"}
                        />
                        <AvatarFallback>
                            {session.user?.name
                                ? session.user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
                                : (session.user?.email ? session.user.email[0].toUpperCase() : "U")}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-semibold text-base text-foreground">{session.user.name || session.user.email}</span>
                        <span className="text-xs text-muted-foreground">{session.user.email}</span>
                    </div>
                </div>
                <Button
                    className="w-full mt-2"
                    onClick={() => signOut()}
                >
                    Çıkış Yap
                </Button>
            </div>
        );
    }

    return (
        <Button onClick={() => signIn("auth0", { prompt: "login" })}>
            Auth0 ile Giriş Yap
        </Button>
    );
}