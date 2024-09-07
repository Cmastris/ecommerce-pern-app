import { createMemoryRouter, RouterProvider } from "react-router-dom";

export function createRouterProvider(
  component: React.JSX.Element,
  path = "/",
  initialEntries = ["/"]
) {
  // Create a simple `RouterProvider` for tests that don't involve routing
  // This is required when rendering components that use React Router functions/components
  const router = createMemoryRouter(
    [{ path: path, element: component }],
    { initialEntries: initialEntries }
  );
  return <RouterProvider router={router} />
}
