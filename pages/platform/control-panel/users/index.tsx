import PageWrapper from "@/components/wrappers/PageWrapper";
import PlatformWrapper from "@/components/wrappers/PlatformWrapper";
import { useState, useEffect } from "react";
import supabase from "@/lib/supabase-browser";
import Table from "@/components/ui/Table";
import { selectOrgState } from "@/store/orgSlice";
import { useSelector } from "react-redux";
import Badge from "@/components/ui/Badge";
import PageTitle from "@/components/ui/PageTitle";
import InviteUserButton from "@/components/platform/control-panel/InviteUserButton";

export default function GeneralSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const orgState = useSelector(selectOrgState);

  const fetchUsers = async () => {
    setLoading(true);
    const { data: usersResults } = await supabase.functions.invoke(
      "get-org-users",
      {
        body: { organization: orgState },
      }
    );
    if (usersResults) {
      setUsers(usersResults.results);
    }
    setLoading(false);
  };

  const channel = supabase
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
        console.log(entryExistsAlready);
        console.log(payload);
        if (entryExistsAlready.length === 0) {
          setUsers((oldArray) => [...oldArray, payload.new]);
          console.log(users);
        }
      }
    )
    .subscribe();

  useEffect(() => {
    try {
      fetchUsers();
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }, [orgState]);
  const tableHeaders = [
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
        if (item === "admin") {
          return <Badge style='green'>Administrator</Badge>;
        } else {
          if (item && item.confirmed) {
            return <Badge style='gray'>Bruger</Badge>;
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
  ];
  const tableOptions = {
    fullWidth: false,
  };

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
