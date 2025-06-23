import type { NextAuthOptions } from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";

export const authOptions: NextAuthOptions = {
    providers: [
        Auth0Provider({
            clientId: process.env.AUTH0_CLIENT_ID!,
            clientSecret: process.env.AUTH0_CLIENT_SECRET!,
            issuer: process.env.AUTH0_DOMAIN!,
            authorization: {
                params: {
                    prompt: "login",
                }
            }
        }),
    ],
    session: {
        strategy: "jwt", // JWT tabanlı oturum yönetimi
    },
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, account }) {
            if (account && account.id_token) {
                try {
                    const idToken = account.id_token;
                    const payload = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString());
                    token.role = payload["https://your-app.com/roles"]?.[0] || "user";
                } catch (error) {
                    // Malformed token durumunda default role ata
                    console.warn('Failed to parse id_token:', error);
                    token.role = "user";
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role;
            }
            return session;
        },
    },
};