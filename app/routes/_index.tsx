import { homeLoader } from "~/modules/Website/Home/index.server";
import Home from "~/modules/Website/Home";

export const loader = async () => {
  return await homeLoader();
};

const App = () => {
  return <Home />;
};

export default App;
