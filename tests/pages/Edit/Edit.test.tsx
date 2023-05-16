import { lightTheme, ThemeProvider } from "@deskpro/deskpro-ui";
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react/";
import * as Api from "../../../src/api/api";
import React from "react";
import { Edit } from "../../../src/pages/Edit/Edit";
import RouterDom from "react-router-dom";

const renderPage = () => {
  return render(
    <ThemeProvider theme={lightTheme}>
      <Edit />
    </ThemeProvider>
  );
};

jest.mock("../../../src/api/api", () => {
  return {
    editCustomer: jest.fn(),
    editOrder: jest.fn(),
    getOrderById: () => ({}),
    getCustomerById: () => ({}),
  };
});

describe("Edit Page", () => {
  test("Editing a customer should work correctly", async () => {
    const { getByTestId } = renderPage();

    fireEvent.change(getByTestId("input-first_name"), {
      target: { value: "First name" },
    });

    fireEvent.change(getByTestId("input-last_name"), {
      target: { value: "Last name" },
    });

    fireEvent.change(getByTestId("input-email"), {
      target: { value: "email@gmail.com" },
    });

    fireEvent.change(getByTestId("input-billing,phone"), {
      target: { value: "123" },
    });

    fireEvent.click(getByTestId("button-submit"));

    await waitFor(() => {
      expect(Api.editCustomer).toHaveBeenCalledTimes(1);
    });
  });

  test("Editing an order should work correctly", async () => {
    jest.spyOn(RouterDom, "useParams").mockImplementation(() => ({
      type: "order",
      id: "1",
    }));

    const { getByTestId } = renderPage();

    [
      "first_name",
      "last_name",
      "address_1",
      "address_2",
      "city",
      "state",
      "postcode",
    ].forEach((field) => {
      fireEvent.change(getByTestId(`input-billing,${field}`), {
        target: { value: "First name" },
      });
      fireEvent.change(getByTestId(`input-shipping,${field}`), {
        target: { value: "First name" },
      });
    });

    await waitFor(() => {
      fireEvent.click(getByTestId("button-submit"));

      expect(Api.editOrder).toHaveBeenCalledTimes(1);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();

    cleanup();
  });
});
