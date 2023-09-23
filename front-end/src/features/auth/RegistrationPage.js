import { Form, Link } from "react-router-dom";

export async function registerAction({ request }) {
  // https://reactrouter.com/en/main/start/tutorial#data-writes--html-forms
  // https://reactrouter.com/en/main/route/action
  console.log('Form submitted');
  return null;
}


export function RegistrationPage() {
  // https://reactrouter.com/en/main/components/form
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
    </div>
  );
}
