import { Form, redirect, useActionData, useRouteLoaderData, useSearchParams } from "react-router-dom";

import { AuthData } from "./authData";
import InlineLink from "../../components/InlineLink/InlineLink";
import GoogleAuthButton from "./GoogleAuthButton";

import utilStyles from "../../App/utilStyles.module.css";


export async function loginAction({ request }: { request: Request }) {
  // https://reactrouter.com/en/main/start/tutorial#data-writes--html-forms
  // https://reactrouter.com/en/main/route/action
  let formData = await request.formData();
  try {
    const username = formData.get("email_address");
    const password = formData.get("password");
    const res = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password })
      }
    );

    if (res.ok) {
      let redirectPath = new URL(request.url).searchParams.get("redirect") || "/account";
      if (redirectPath.charAt(0) !== "/") {
        // Prevent external navigation
        redirectPath = `/${redirectPath}`;
      }
      return redirect(redirectPath);

    } else if (res.status === 401) {
      return "Login failed. The username or password is incorrect.";
    }
    throw new Error("Unexpected status code.");
  } catch (error) {
    return "Sorry, login failed. Please try again later.";
  }
}


export function LoginPage() {
  // https://reactrouter.com/en/main/components/form
  // https://reactrouter.com/en/main/hooks/use-action-data
  // https://reactrouter.com/en/main/hooks/use-route-loader-data
  const authData = useRouteLoaderData("app") as AuthData;
  const loginError = useActionData() as string | undefined;
  const [searchParams] = useSearchParams();
  const isGoogleError = searchParams.get("googleAuthError");

  const registerLink = <InlineLink path="/register" anchor="register" />;
  const loggedOutContent = <>If you haven't created an account, please {registerLink} first or sign in with Google below.</>;
  const loggedInContent = <>You are already logged in as {authData.email_address}.</>;
  const googleError = <>Sorry, Google sign in failed. Please try again later or {registerLink} instead.</>;

  return (
    <div className={`${utilStyles.pagePadding} ${utilStyles.mw80rem}`}>
      <h1 className={utilStyles.h1}>Log in</h1>
      <p className={utilStyles.mb2rem}>{authData.logged_in ? loggedInContent : loggedOutContent}</p>
      <Form method="post" className={utilStyles.stackedForm}>
        <label htmlFor="email_address" className={utilStyles.label}>Email</label>
        <input id="email_address" className={utilStyles.input} type="email" name="email_address" required />
        <label htmlFor="password" className={utilStyles.label}>Password</label>
        <input id="password" className={utilStyles.input} type="password" name="password" required />
        <button type="submit" className={utilStyles.button}>Log in</button>
      </Form>
      <p>{loginError ? loginError : null}</p>
      <hr className={utilStyles.separator} />
      <GoogleAuthButton />
      <p>{isGoogleError ? googleError : null}</p>
    </div>
  );
}
