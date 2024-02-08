import { homeLoader } from "~/modules/Website/Home/index.server";
import Home from "~/modules/Website/Home";
import { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = ({ data }) => {
  const loaderMeta = (data as { meta: MetaType })?.meta;
  return [
    { title: loaderMeta?.title },
    {
      name: "description",
      content: loaderMeta?.description,
    },
  ];
};

export const loader = async () => {
  return await homeLoader();
};

const App = () => {
  return <Home />;
};

export default App;
