import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', "/"]);

export default clerkMiddleware((auth, req) => {

    if (!auth().userId && !isPublicRoute(req)) {
        return auth().redirectToSignIn({ returnBackUrl: req.url });
    }

    if (auth().userId && isPublicRoute(req)) {
        const path = auth().orgId ? `/organization/${auth().orgId}` : "/select-org";
        return NextResponse.redirect(new URL(path, req.url));
    }


    if (auth().userId && !auth().orgId && req.nextUrl.pathname !== "/select-org") {
        return NextResponse.redirect(new URL("/select-org", req.url));
    }

});

export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};

/*

{
    publicRoutes: ["/"],
    afterAuth(auth, req) {
        if (!auth.userId && !auth.isPublicRoute) {
            return redirectToSignIn({ returnBackUrl: req.url });
        }

        if (auth.userId && auth.isPublicRoute) {
            const path = auth.orgId ? `/organization/${auth.orgId}` : "/select-org";
            const orgSelection = new URL(path, req.url);
            return NextResponse.redirect(orgSelection);
        }

        if (auth.userId && !auth.orgId && req.nextUrl.pathname !== "/select-org") {
            const orgSelection = new URL("/select-org", req.url);
            return NextResponse.redirect(orgSelection);
        }
    }
}
*/