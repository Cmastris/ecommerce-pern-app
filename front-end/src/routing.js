import { createBrowserRouter } from "react-router-dom";

import App from "./App/App";
import ErrorPage from "./components/ErrorPage/ErrorPage";
import { RegistrationPage, registerAction } from "./features/auth/RegistrationPage";


// https://reactrouter.com/en/main/routers/create-browser-router
export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "register",
        element: <RegistrationPage />,
        action: registerAction,
      },
    ],
  },
]);
