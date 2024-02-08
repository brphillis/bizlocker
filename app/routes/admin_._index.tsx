import { MetaFunction } from "@remix-run/node";
import AdminHome from "~/modules/Admin/Home";
import { adminHomeLoader } from "~/modules/Admin/Home/index.server";

export const meta: MetaFunction = () => {
  return [
    { title: "CLUTCH | Admin Portal" },
    {
      name: "description",
      content: "Clutch Clothing Administration Portal",
    },
  ];
};

export const loader = async () => {
  return await adminHomeLoader();
};

const App = () => {
  return <AdminHome />;
};

export default App;
