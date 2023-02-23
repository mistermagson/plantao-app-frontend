import Head from "next/head";
import '../styles/styles.scss'
import Layout from "../components/layout";

export default function MyApp({ Component, pageProps }) {

     return(
        <>
            <Layout>
                <Head>
                    <meta name="viewport" content="initial-scale=1, width=device-width" />
                </Head>
                <Component {...pageProps} />
            </Layout>

        </>
    );
}
