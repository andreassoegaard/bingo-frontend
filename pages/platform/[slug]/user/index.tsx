import { GetServerSidePropsContext } from "next";

import PageWrapper from "@/components/wrappers/PageWrapper";
import PlatformWrapper from "@/components/wrappers/PlatformWrapper";
import serverProps from "@/lib/server-props";
import merge from "lodash.merge";

export default function GeneralSettingsPage() {
  return (
    <PageWrapper title='Rediger bruger'>
      <PlatformWrapper></PlatformWrapper>
    </PageWrapper>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return merge(await serverProps(ctx), {
    props: {},
  });
};
