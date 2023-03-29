import supabase from "@/lib/supabase-browser";
import { useRouter } from "next/router";

export default function LogOutButton() {
  const router = useRouter();
  const clickHandler = async (event: any) => {
    event.preventDefault();
    const { error } = await supabase.auth.signOut();
    console.log(error);
    router.replace("/login");
  };
  return <button onClick={clickHandler}>Log out</button>;
}
