import { useRouter } from "next/router";

export function useOrgId() {
  const router = useRouter();
  if (router.asPath && router.asPath.includes("/platform")) {
    return Number(
      router.asPath.split("/platform")[1].split("/")[1].split("-").pop()
    );
  } else {
    return null;
  }
}
