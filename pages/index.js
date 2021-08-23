import Head from "next/head";
import MediaSync from "./containers/media-sync";

import "antd/dist/antd.css";

const App = () => (
  <>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Head>
    <MediaSync />
  </>
);

export default App;
