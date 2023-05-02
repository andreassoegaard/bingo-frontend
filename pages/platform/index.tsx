import { GetServerSidePropsContext } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

export default function PlatformIndex() {}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx);

  let { data: organizations } = await supabase
    .from("organizations")
    .select("*");

  if (organizations && organizations.length > 0) {
    return {
      redirect: {
        permanent: false,
        destination: `/platform/${organizations[0].slug}`,
      },
    };
  } else {
    await supabase.auth.signOut();
    return {
      props: {},
    };
  }
};
