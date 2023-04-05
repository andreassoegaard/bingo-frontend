import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

export default async function getServerSideProps(ctx) {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx);
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } else {
    return {
      props: {
        initialSession: session,
        user: session.user,
      },
    };
  }
}
