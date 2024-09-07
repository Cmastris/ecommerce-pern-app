import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import { createRouterProvider } from "../test-setup/testRouters";
import { App } from "./App";

// https://testing-library.com/docs/react-testing-library/intro
// https://testing-library.com/docs/react-testing-library/example-intro
// https://github.com/testing-library/jest-dom

test("App name is rendered", () => {
  render(createRouterProvider(<App />));
  expect(screen.getByText("Pern")).toBeInTheDocument();
  expect(screen.getByText("ecom")).toBeInTheDocument();
});
