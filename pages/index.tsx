import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useEffect } from "react";
import Head from "next/head";
import supabase from "@/lib/supabase-browser";

export default function Home() {
  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      // console.log(event);
    });
  }, []);
}

export const getServerSideProps = async (ctx: any) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx);
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    return {
      redirect: {
        destination: "/platform",
        permanent: false,
      },
    };
  } else {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
};
