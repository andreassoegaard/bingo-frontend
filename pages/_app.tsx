import "@/styles/globals.scss";
import "@/styles/buttons.scss";
import "@/styles/badges.scss";
import "@/styles/placeholder.scss";
import "@/styles/wrappers.scss";
import type { AppProps } from "next/app";
import supabaseClient from "@/lib/supabase-browser";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { wrapper } from "@/store/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import PageLoading from "@/components/ui/PageLoading";

export default function App({ Component, pageProps, ...rest }: AppProps) {
  const { store } = wrapper.useWrappedStore(rest);

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loaderSize, setLoaderSize] = useState("full");
  useEffect(() => {
    const start = (url: string) => {
      console.log("start");
      if (!router.asPath.includes("/settings") && url.includes("/settings")) {
        setLoaderSize("large");
      } else {
        setLoaderSize("full");
      }
      if (url.includes("/settings")) {
        if (!router.asPath.includes("/settings")) {
          setLoading(true);
        } else {
          setLoading(false);
        }
      } else {
        setLoading(true);
      }
    };
    const end = () => {
      console.log("finished");
      setLoading(false);
    };
    router.events.on("routeChangeStart", start);
    router.events.on("routeChangeComplete", end);
    router.events.on("routeChangeError", end);
    return () => {
      router.events.off("routeChangeStart", start);
      router.events.off("routeChangeComplete", end);
      router.events.off("routeChangeError", end);
    };
  }, [router.asPath, router.events]);
  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <Provider store={store}>
        <PersistGate persistor={store.__persistor} loading={<div>Loading</div>}>
          {loading ? (
            <PageLoading size={loaderSize} />
          ) : (
            <Component {...pageProps} />
          )}
        </PersistGate>
      </Provider>
    </SessionContextProvider>
  );
}
