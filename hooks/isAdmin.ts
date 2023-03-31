import { selectOrgState } from "@/store/orgSlice";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import supabase from "@/lib/supabase-browser";

export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const orgState = useSelector(selectOrgState);
  useEffect(() => {
    const findOutIfAdmin = async () => {
      const { data: userAdminOrgs, error } = await supabase.rpc(
        "get_my_claim",
        { claim: "admin_organizations" }
      );
      const currentOrg = orgState.toString();
      if (userAdminOrgs && userAdminOrgs.includes(currentOrg)) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    };
    findOutIfAdmin();
  }, [orgState]);
  return isAdmin;
}
