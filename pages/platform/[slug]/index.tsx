import { useEffect, useState } from "react";
import supabase from "@/lib/supabase-browser";
import LogOutButton from "@/components/auth/LogOutButton";
import PlatformWrapper from "@/components/wrappers/PlatformWrapper";
import groupBy from "lodash.groupby";
import PageWrapper from "@/components/wrappers/PageWrapper";
import Button from "@/components/ui/Button";
import { selectOrgState, selectOrgName, setOrgState } from "@/store/orgSlice";
import { useDispatch, useSelector } from "react-redux";
import { useIsAdmin } from "@/hooks/isAdmin";
import PageTitle from "@/components/ui/PageTitle";
import serverProps from "@/lib/server-props";
import merge from "lodash.merge";
import { Suspense } from "react";

export default function Home(props: any) {
  const orgName = useSelector(selectOrgName);
  const orgState = useSelector(selectOrgState);
  const dispatch = useDispatch();
  const isAdmin = useIsAdmin();

  useEffect(() => {
    const fetchSession = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
    };
    fetchSession();
  }, []);

  const [plates, setPlates] = useState<any[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("banko_plates").select();
      setPlates(
        Object.entries(groupBy(data, "group_key")).map(
          (item: any) => (item = item[1])
        )
      );
    };
    fetchData();
  }, []);
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

export const getServerSideProps = async (ctx: any) => {
  return merge(await serverProps(ctx), {
    props: {},
  });
};
