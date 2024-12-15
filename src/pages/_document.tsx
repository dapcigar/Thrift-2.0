import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Modern ROSCA (Rotating Savings and Credit Association) application" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
