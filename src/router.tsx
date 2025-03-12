import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";

import Layout from "./pages/Layout";
import GamePage from "./pages/GamePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/game",
        element: <GamePage />,
      },
    ],
  },
]);

export default router;
