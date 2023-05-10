import { lightTheme, ThemeProvider } from "@deskpro/deskpro-ui";
import { cleanup, render, waitFor } from "@testing-library/react/";
import React from "react";
import { View } from "../../../src/pages/View/View";

const renderPage = () => {
  return render(
    <ThemeProvider theme={lightTheme}>
      <View />
    </ThemeProvider>
  );
};

jest.mock("../../../src/api/api", () => {
  return {
    getCustomerById: () => ({
      id: 1,
      first_name: "John",
      last_name: "Doe",
      email: "a@b.com",
      billing: {
        phone: "123456789",
      },
      shipping: {
        address_1: "House 2",
        address_2: "Address 2",
        city: "London",
        state: "London",
        postcode: "N1 1AA",
      },
    }),
  };
});

describe("View", () => {
  test("View page should show a contact correctly", async () => {
    const { getByText } = renderPage();

    const phone = await waitFor(() => getByText(/123456789/i));

    const email = await waitFor(() => getByText(/a@b.com/i));

    const address = await waitFor(() =>
      getByText(/House 2 Address 2, London London N1 1AA/i)
    );

    await waitFor(() => {
      [phone, email, address].forEach((el) => {
        expect(el).toBeInTheDocument();
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();

    cleanup();
  });
});
