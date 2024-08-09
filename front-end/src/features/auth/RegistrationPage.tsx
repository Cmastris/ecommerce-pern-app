import { Form, redirect, useActionData, useRouteLoaderData } from "react-router-dom";

import { AuthData } from "./authData";
import InlineLink from "../../components/InlineLink/InlineLink";
import utilStyles from "../../App/utilStyles.module.css";
import GoogleAuthButton from "./GoogleAuthButton";


export async function registerAction({ request }: { request: Request }) {
  // https://reactrouter.com/en/main/start/tutorial#data-writes--html-forms
  // https://reactrouter.com/en/main/route/action
  let formData = await request.formData();
  try {
    const email_address = formData.get("email_address");
    const password = formData.get("password");
    const res = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/auth/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email_address, password })
      }
    );

    if (res.ok) {
      return redirect("/account");
    } else if (res.status === 400) {
      return "Sorry, someone is already registered with this email address.";
    }
    throw new Error("Unexpected status code.");
  } catch (error) {
    return "Sorry, registration failed. Please try again later.";
  }
}


export function RegistrationPage() {
  // https://reactrouter.com/en/main/components/form
  // https://reactrouter.com/en/main/hooks/use-action-data
  // https://reactrouter.com/en/main/hooks/use-route-loader-data
  const authData = useRouteLoaderData("app") as AuthData;
  const registrationError = useActionData() as string | undefined;

  const loginLink = <InlineLink path="/login" anchor="log in" />;
  const loggedOutContent = (
    <>Create an account or alternatively sign in with Google.
    If you already have an account, please {loginLink} instead.</>
  );
  const loggedInContent = <>You are already logged in as {authData.email_address}.</>;

  return (
    <div className={`${utilStyles.pagePadding} ${utilStyles.mw80rem}`}>
      <h1 className={utilStyles.h1}>Create your account</h1>
      <p className={utilStyles.mb2rem}>{authData.logged_in ? loggedInContent : loggedOutContent}</p>
      <Form method="post" className={utilStyles.stackedForm}>
        <label htmlFor="email_address" className={utilStyles.label}>Email</label>
        <input id="email_address" className={utilStyles.input} type="email" name="email_address" minLength={5} required />
        <label htmlFor="password" className={utilStyles.label}>Password</label>
        <input id="password" className={utilStyles.input} type="password" name="password" minLength={8} maxLength={25} required />
        <button type="submit" className={utilStyles.button}>Register</button>
      </Form>
      <p>{registrationError ? registrationError : null}</p>
      <hr className={utilStyles.separator} />
      <GoogleAuthButton />
    </div>
  );
}
