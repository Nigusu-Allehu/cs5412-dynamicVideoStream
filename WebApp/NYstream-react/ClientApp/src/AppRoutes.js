import { Upload } from "./components/Upload";
import { List_videos } from "./components/List_videos";
import { Home } from "./components/Home";

const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
      path: '/upload',
      element: <Upload />
  },
  {
      path: '/listvideos',
      element: <List_videos />
    }
];

export default AppRoutes;
