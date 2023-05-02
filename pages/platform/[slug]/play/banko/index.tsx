import { GetServerSidePropsContext } from "next";

import PageWrapper from "@/components/wrappers/PageWrapper";
import PlatformWrapper from "@/components/wrappers/PlatformWrapper";
import PageTitle from "@/components/ui/PageTitle";
import serverProps from "@/lib/server-props";
import merge from "lodash.merge";
import CreateBankoGroupButton from "@/components/platform/play/banko/CreateBankoGroupButton";
import Table from "@/components/ui/Table";
import { useMemo, useState, useEffect } from "react";
import { useOrgId } from "@/hooks/useOrgId";
import supabase from "@/lib/supabase-browser";
import { useRouter } from "next/router";

export default function GeneralSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState<any[]>([]);

  const tableHeaders = useMemo(() => {
    return [
      {
        id: "name",
        title: "Navn",
        classes: "font-semibold",
      },
      {
        id: "created_at",
        title: "Dato oprettet",
        customContent: (item: any) => {
          const date = new Date(item.created_at);
          return date.toLocaleDateString("da-DK", {
            day: "numeric",
            year: "numeric",
            month: "long",
            hour: "numeric",
            minute: "numeric",
          });
        },
      },
      {
        id: "edit",
        title: "",
      },
      {
        id: "delete",
        title: "",
        show: () => {
          return true;
        },
      },
    ];
  }, []);

  supabase
    .channel("banko_games_groups")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "banko_games_groups",
      },
      (payload) => {
        if (payload.eventType === "DELETE") {
          setGroups((oldArray) =>
            oldArray.filter((item) => item.id !== payload.old.id)
          );
        } else {
          const entryExistsAlready = groups.filter(
            (item) => item.id === payload.new.id
          );
          if (entryExistsAlready.length === 0) {
            setGroups((oldArray) => [payload.new, ...oldArray]);
          }
        }
      }
    )
    .subscribe();

  const orgId = useOrgId();
  useEffect(() => {
    try {
      const fetchGroups = async () => {
        setLoading(true);
        let { data: groupsResults, error } = await supabase
          .from("banko_games_groups")
          .select("*")
          .eq("organization_id", orgId)
          .order("id", { ascending: false });

        if (groupsResults) {
          setGroups(groupsResults);
        }
        setLoading(false);
      };

      fetchGroups();
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }, [orgId]);

  const [deleteLoading, setDeleteLoading] = useState(false);
  const router = useRouter();
  const tableOptions = useMemo(() => {
    return {
      fullWidth: false,
      editText: "Gå til spilgruppe",
      rowClick: async (item: any) => {
        router.replace(router.asPath + "/" + item.id);
      },
      deleteModal: {
        title: "Slet spilgruppe",
        description:
          "Er du sikker på du ønsker at slette denne spilgruppe?<br />Alle underliggende spil vil også blive slettet. Det kan ikke fortrydes.",
        loading: deleteLoading,
        deleteClick: async (item: any) => {
          setDeleteLoading(true);
          await supabase
            .from("banko_games_groups")
            .delete()
            .eq("id", Number(item.id));
          setDeleteLoading(false);
        },
      },
    };
  }, [deleteLoading, router]);

  // const [tableOptions, setTableOptions] = useState({
  //   editIdFetch: null,
  //   deleteClick: async (item: any) => {
  //     try {
  //       showDeleteWarningModal(item);
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   },
  //   rowClick: async (item: any) => {
  //     try {
  //       setTableOptions({
  //         ...tableOptions,
  //         editIdFetch: item.id,
  //       });
  //       setEditingId(item.id);
  //       const data = await fetchWrapper.get(
  //         `${process.env.API_URL}/api/qaFactors/${props.params.id}/${item.id}`
  //       );
  //       setEditName(data.result.name);
  //       setEditDescription(data.result.description);
  //       setEditImportance(data.result.importance);
  //       setShowEditModal(true);
  //       setTableOptions({
  //         ...tableOptions,
  //         editIdFetch: null,
  //       });
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   },
  // });

  return (
    <PageWrapper title='Banko'>
      <PlatformWrapper>
        <PageTitle
          subtitle='Herunder vises alle bankospil inddelt i grupper. Hver gruppe kan indeholde flere bankospil.'
          rightCol={<CreateBankoGroupButton currentGroups={groups} />}
        >
          Spil banko
        </PageTitle>
        <Table
          headers={tableHeaders}
          data={groups}
          loading={loading}
          options={tableOptions}
        />
      </PlatformWrapper>
    </PageWrapper>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return merge(await serverProps(ctx), {
    props: {},
  });
};
