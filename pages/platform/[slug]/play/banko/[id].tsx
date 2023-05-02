import { GetServerSidePropsContext } from "next";

import PageWrapper from "@/components/wrappers/PageWrapper";
import PlatformWrapper from "@/components/wrappers/PlatformWrapper";
import PageTitle from "@/components/ui/PageTitle";
import serverProps from "@/lib/server-props";
import merge from "lodash.merge";
import supabase from "@/lib/supabase-browser";
import supabaseServer from "@/lib/supabase-server";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { PropsWithChildren } from "react";
import { NextResponse } from "next/server";

interface Props {
  group: {
    name: string;
  };
}

export default function BankoGroupPage(props: Props) {
  // const router = useRouter();
  // useEffect(() => {
  //   const fetchData = async () => {
  //     let { data, error } = await supabase
  //       .from("banko_games_groups")
  //       .select("*")
  //       .eq("id", Number(router.query.id));
  //     console.log(data);
  //   };
  //   fetchData();
  // }, []);

  return (
    <PageWrapper title='Rediger'>
      <PlatformWrapper>
        <PageTitle>{props.group.name}</PageTitle>
      </PlatformWrapper>
    </PageWrapper>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx);
  let { data: banko_games_groups, error } = await supabase
    .from("banko_games_groups")
    .select("*")
    .eq("id", Number(ctx.params?.id));

  if (
    error ||
    (banko_games_groups && banko_games_groups.length === 0) ||
    !banko_games_groups
  ) {
    return {
      notFound: true,
    };
  }

  return merge(await serverProps(ctx), {
    props: {
      group:
        banko_games_groups && banko_games_groups.length > 0
          ? banko_games_groups[0]
          : null,
    },
  });
};
