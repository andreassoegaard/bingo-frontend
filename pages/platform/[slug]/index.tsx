import { Suspense } from "react";
import { GetServerSidePropsContext } from "next";

import LogOutButton from "@/components/auth/LogOutButton";
import PlatformWrapper from "@/components/wrappers/PlatformWrapper";
import PageWrapper from "@/components/wrappers/PageWrapper";
import PageTitle from "@/components/ui/PageTitle";
import serverProps from "@/lib/server-props";
import merge from "lodash.merge";

export default function Home() {
  return (
    <>
      <PageWrapper title='Forside'>
        <PlatformWrapper>
          <Suspense fallback={<p>Loading</p>}>
            <PageTitle>Forside</PageTitle>
            <LogOutButton />
          </Suspense>
        </PlatformWrapper>
      </PageWrapper>
    </>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return merge(await serverProps(ctx), {
    props: {},
  });
};
