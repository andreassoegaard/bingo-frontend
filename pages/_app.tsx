import "@/styles/globals.scss";
import "@/styles/buttons.scss";
import type { AppProps } from "next/app";
import supabaseClient from "@/lib/supabase-browser";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { wrapper } from "@/store/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

export default function App({ Component, pageProps, ...rest }: AppProps) {
  const { store } = wrapper.useWrappedStore(rest);
  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <Provider store={store}>
        <PersistGate persistor={store.__persistor} loading={<div>Loading</div>}>
          <Component {...pageProps} />
        </PersistGate>
      </Provider>
    </SessionContextProvider>
  );
}
