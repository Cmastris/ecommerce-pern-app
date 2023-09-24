import { Form, Link, redirect, useActionData } from "react-router-dom";

export async function loginAction({ request }) {
  // https://reactrouter.com/en/main/start/tutorial#data-writes--html-forms
  // https://reactrouter.com/en/main/route/action
  let formData = await request.formData();
  try {
    const username = formData.get("email_address");
    const password = formData.get("password");
    const res = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/auth/login`,
      {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      }
    );

    if (res.ok) {
      return redirect("/account");
    } else if (res.status === 401) {
      return "Login failed. The username or password is incorrect.";
    }
    throw new Error('Unexpected status code.');
  } catch (error) {
    return "Sorry, login failed. Please try again later.";
  }
}


export function LoginPage() {
  // https://reactrouter.com/en/main/components/form
  // https://reactrouter.com/en/main/hooks/use-action-data
  const loginError = useActionData();

  return (
    <div>
      <h1>Log in</h1>
      <p>If you haven't created an account, please <Link to="/register">register</Link> instead.</p>
      <Form method="post">
        <label htmlFor="email_address">Email</label>
        <input id="email_address" type="email" name="email_address" required />
        <label htmlFor="password">Password</label>
        <input id="password" type="password" name="password" required />
        <button type="submit">Submit</button>
      </Form>
      <p>{loginError ? loginError : null}</p>
    </div>
  );
}
