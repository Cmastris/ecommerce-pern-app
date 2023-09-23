import { createBrowserRouter } from "react-router-dom";
import App from "./App/App";


// https://reactrouter.com/en/main/routers/create-browser-router
export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [],
  },
]);
