import { GetServerSidePropsContext } from "next";

import PageWrapper from "@/components/wrappers/PageWrapper";
import PlatformWrapper from "@/components/wrappers/PlatformWrapper";
import { useState, useEffect, useMemo } from "react";
import supabase from "@/lib/supabase-browser";
import Table from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import PageTitle from "@/components/ui/PageTitle";
import InviteUserButton from "@/components/platform/control-panel/InviteUserButton";
import serverProps from "@/lib/server-props";
import merge from "lodash.merge";
import { useOrgId } from "@/hooks/useOrgId";

export default function GeneralSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  supabase
    .channel("users")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "users",
      },
      (payload) => {
        const entryExistsAlready = users.filter(
          (item) => item.id === payload.new.id
        );
        if (entryExistsAlready.length === 0) {
          setUsers((oldArray) => [...oldArray, payload.new]);
        }
      }
    )
    .subscribe();

  const orgId = useOrgId();
  useEffect(() => {
    try {
      const fetchUsers = async () => {
        setLoading(true);
        const { data: usersResults } = await supabase.functions.invoke(
          "get-org-users",
          {
            body: { organization: orgId },
          }
        );
        if (usersResults) {
          setUsers(usersResults.results);
        }
        setLoading(false);
      };

      fetchUsers();
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }, [orgId]);

  const tableHeaders = useMemo(() => {
    return [
      {
        id: "name",
        title: "Navn",
        classes: "font-semibold",
      },
      {
        id: "email",
        title: "E-mail-adresse",
      },
      {
        id: "role",
        title: "Rolle",
        customContent: (item: any) => {
          if (item.role === "admin") {
            return <Badge style='green'>Administrator</Badge>;
          } else {
            if (item && item.confirmed) {
              return <Badge style='gray'>Alm. bruger</Badge>;
            } else {
              return (
                <>
                  <Badge style='gray' className='mr-1'>
                    Alm. bruger
                  </Badge>
                  <Badge style='yellow'>Ikke bekræftet endnu</Badge>
                </>
              );
            }
          }
        },
      },
      {
        id: "delete",
        title: "",
        show: (item: any) => {
          if (item.email === "andreassoegaard93@gmail.com") {
            return false;
          } else {
            return true;
          }
        },
      },
    ];
  }, []);

  const [deleteLoading, setDeleteLoading] = useState(false);
  const tableOptions = useMemo(() => {
    return {
      fullWidth: false,
      deleteModal: {
        title: "Slet bruger",
        description:
          "Er du sikker på du ønsker at slette denne bruger?<br />Det kan ikke fortrydes.",
        loading: deleteLoading,
        deleteClick: (item: any) => {
          setDeleteLoading(true);
          console.log(item);
          setTimeout(() => {
            setDeleteLoading(false);
          }, 2000);
        },
      },
    };
  }, [deleteLoading]);

  return (
    <PageWrapper title='Brugere'>
      <PlatformWrapper>
        <PageTitle
          subtitle='Alle brugere i denne organisation vises herunder'
          rightCol={<InviteUserButton />}
        >
          Brugere
        </PageTitle>
        <Table
          headers={tableHeaders}
          data={users}
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
