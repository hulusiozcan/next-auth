import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const userRole = req.nextauth?.token?.role;

        const isAdminPath = req.nextUrl?.pathname?.startsWith("/admin") &&
            (req.nextUrl.pathname === "/admin" || req.nextUrl.pathname.startsWith("/admin/"));

        if (isAdminPath && userRole !== "admin") {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    },
    {
        pages: {
            signIn: "/login",
        },
        callbacks: {
            authorized: ({ token }) => !!token, // Oturum var mı kontrolü
        },
    }
);

export const config = {
    matcher: ["/dashboard/:path*", "/admin/:path*"],
};