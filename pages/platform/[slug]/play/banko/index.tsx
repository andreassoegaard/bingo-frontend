import PageWrapper from "@/components/wrappers/PageWrapper";
import PlatformWrapper from "@/components/wrappers/PlatformWrapper";
import PageTitle from "@/components/ui/PageTitle";
import serverProps from "@/lib/server-props";
import merge from "lodash.merge";

export default function GeneralSettingsPage() {
  return (
    <PageWrapper title='Spil banko'>
      <PlatformWrapper>
        <PageTitle>Spil banko</PageTitle>
      </PlatformWrapper>
    </PageWrapper>
  );
}

export const getServerSideProps = async (ctx: any) => {
  return merge(await serverProps(ctx), {
    props: {},
  });
};
