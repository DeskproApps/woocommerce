import { lightTheme, ThemeProvider } from "@deskpro/deskpro-ui";
import { cleanup, render, waitFor } from "@testing-library/react/";
import React from "react";
import { Main } from "../../src/pages/Main";

const renderPage = () => {
  return render(
    <ThemeProvider theme={lightTheme}>
      <Main />
    </ThemeProvider>
  );
};

jest.mock("../../src/api/api", () => {
  return {
    getCustomersByEmail: () => [
      {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        email: "a@b.com",
        billing: {
          phone: "123456789",
        },
        shipping: {},
      },
    ],
    getOrders: () => [
      {
        total: 1,
        currency: "USD",
        status: "completed",
      },
    ],
  };
});

describe("Main", () => {
  test("Main page should show all data correctly", async () => {
    const { getByText } = renderPage();

    const status = await waitFor(() => getByText(/Completed/i));

    const totalSpent = await waitFor(() => getByText(/\$1.00/i));

    const email = await waitFor(() => getByText(/a@b.com/i));

    await waitFor(() => {
      [status, totalSpent, email].forEach((el) => {
        expect(el).toBeInTheDocument();
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();

    cleanup();
  });
});
