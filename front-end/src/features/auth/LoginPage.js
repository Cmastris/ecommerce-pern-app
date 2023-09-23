import { Form, Link } from "react-router-dom";

export async function loginAction({ request }) {
  // https://reactrouter.com/en/main/start/tutorial#data-writes--html-forms
  // https://reactrouter.com/en/main/route/action
  console.log('Form submitted');
  return null;
}


export function LoginPage() {
  // https://reactrouter.com/en/main/components/form
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
    </div>
  );
}
