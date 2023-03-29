import { PropsWithChildren } from "react";
import Head from "next/head";

interface Props {
  title: string;
}

export default function PageWrapper(props: PropsWithChildren<Props>) {
  const title = `BingoBuddy | ${props.title}`;
  return (
    <>
      <div>
        <Head>
          <title>{title}</title>
          <meta name='description' content='Bingo' />
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <link rel='icon' href='/favicon.ico' />
        </Head>
        <main>{props.children}</main>
      </div>
    </>
  );
}
