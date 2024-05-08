import { Outlet } from "react-router-dom";
import UpperHeader from "../components/UpperHeader/UpperHeader";


export async function authLoader() {
  // https://reactrouter.com/en/main/start/tutorial#loading-data
  // https://reactrouter.com/en/main/route/loader
  try {
    const res = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/auth/status`,
      { credentials: "include" }
    );
    if (res.ok) {
      const authData = await res.json();
      return authData;
    }
    throw new Error("Unexpected status code.");
  } catch (error) {
    return { logged_in: false, id: null, email_address: null, auth_method: null };
  }
}


export function App() {
  return (
    <div className="App">
      <UpperHeader />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
