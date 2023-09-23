import { Form, Link, redirect, useActionData } from "react-router-dom";

export async function registerAction({ request }) {
  // https://reactrouter.com/en/main/start/tutorial#data-writes--html-forms
  // https://reactrouter.com/en/main/route/action
  let formData = await request.formData();
  try {
    const email_address = formData.get("email_address");
    const password = formData.get("password");
    const res = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/auth/register`,
      {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email_address, password })
      }
    );

    if (res.ok) {
      return redirect("/account");
    } else if (res.status === 400) {
      return "Sorry, someone is already registered with this email address.";
    }
    throw new Error('Unexpected status code.');
  } catch (error) {
    return "Sorry, registration failed. Please try again later.";
  }
}


export function RegistrationPage() {
  // https://reactrouter.com/en/main/components/form
  // https://reactrouter.com/en/main/hooks/use-action-data
  const registrationError = useActionData();

  return (
    <div>
      <h1>Create your account</h1>
      <p>If you already have an account, please <Link to="/login">log in</Link> instead.</p>
      <Form method="post">
        <label htmlFor="email_address">Email</label>
        <input id="email_address" type="email" name="email_address" minLength={5} required />
        <label htmlFor="password">Password</label>
        <input id="password" type="password" name="password" minLength={8} maxLength={25} required />
        <button type="submit">Register</button>
      </Form>
      <p>{registrationError ? registrationError : null}</p>
    </div>
  );
}
