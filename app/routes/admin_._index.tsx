import AdminHome from "~/modules/Admin/Home";
import { adminHomeLoader } from "~/modules/Admin/Home/index.server";

export const loader = async () => {
  return await adminHomeLoader();
};

const App = () => {
  return <AdminHome />;
};

export default App;
