import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { useSlug } from "./hooks/useSlug";

export default async function Middleware(req: NextRequest) {
  // We need to create a response and hand it to the supabase client to be able to modify the response headers.
  const res = NextResponse.next();
  // Create authenticated Supabase Client.
  const supabase = createMiddlewareSupabaseClient({ req, res });
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Error url
  const errorUrl = req.nextUrl.clone();
  errorUrl.pathname = "/404";

  const slugWithId = useSlug(req.nextUrl.pathname);
  const adminUrls = [`/platform/${slugWithId}/control-panel/users`];

  // let { data: organizations, error: organizationsError } = await supabase
  //   .from("organizations")
  //   .select("*")
  //   .eq("slug", slugWithId);

  if (req.nextUrl.pathname === "/platform") {
    return res;
  } else if (slugWithId && session?.user) {
    const slugSplit = slugWithId.split("-");
    const orgId = slugSplit[slugSplit.length - 1];
    const orgName = slugWithId.replace(`-${orgId}`, "");

    const { data: userAdminOrgs } = await supabase.rpc("get_my_claim", {
      claim: "admin_organizations",
    });

    // If URL is an admin-only URL, but the user isn't admin - go to 404 page
    if (
      adminUrls.includes(req.nextUrl.pathname) &&
      (!userAdminOrgs || !userAdminOrgs.includes(orgId))
    ) {
      return NextResponse.rewrite(errorUrl);
    } else {
      return res;
    }
  } else if (!slugWithId && session?.user) {
    // If url does not contain /platform, but user is logged in
    // Return to org home page
    return res;
  } else {
    // Auth condition not met, redirect to home page.
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/login";
    return NextResponse.redirect(redirectUrl);
  }
}

export const config = {
  matcher: "/platform/:path*",
};
