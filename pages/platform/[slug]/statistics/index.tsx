import { GetServerSidePropsContext } from "next";

import PageWrapper from "@/components/wrappers/PageWrapper";
import PlatformWrapper from "@/components/wrappers/PlatformWrapper";
import PageTitle from "@/components/ui/PageTitle";
import serverProps from "@/lib/server-props";
import merge from "lodash.merge";

export default function StatisticsPage() {
  return (
    <PageWrapper title='Statistik'>
      <PlatformWrapper>
        <PageTitle>Statistik</PageTitle>
      </PlatformWrapper>
    </PageWrapper>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return merge(await serverProps(ctx), {
    props: {},
  });
};
