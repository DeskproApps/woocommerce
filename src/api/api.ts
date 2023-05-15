import { IDeskproClient, proxyFetch } from "@deskpro/app-sdk";
import { ICustomer, INote, IOrder, RequestMethod } from "./types";
import { makeFirstLetterUppercase } from "../utils/utils";

export const editCustomer = async (
  client: IDeskproClient,
  domain: string,
  id: string,
  data: IOrder
): Promise<void> => {
  return installedRequest(client, domain, `customers/${id}`, "PUT", data);
};

export const editOrder = async (
  client: IDeskproClient,
  domain: string,
  id: string,
  data: IOrder
): Promise<void> => {
  return installedRequest(client, domain, `orders/${id}`, "PUT", data);
};

export const createOrderNote = async (
  client: IDeskproClient,
  domain: string,
  id: string,
  note: string
): Promise<void> => {
  return installedRequest(client, domain, `orders/${id}/notes`, "GET", {
    note,
  });
};

export const getCustomersByEmail = async (
  client: IDeskproClient,
  domain: string,
  email: string
): Promise<ICustomer[]> => {
  const res: ICustomer[] = await installedRequest(
    client,
    domain,
    `customers?email=${email}role=all`,
    "GET"
  );

  return res.map((e) => ({
    ...e,
    full_name: e.first_name + " " + e.last_name,
  }));
};

export const getOrderNotesByOrderId = (
  client: IDeskproClient,
  domain: string,
  id: string
): Promise<INote[]> => {
  return installedRequest(client, domain, `orders/${id}/notes`, "GET");
};

export const getCustomerById = async (
  client: IDeskproClient,
  domain: string,
  id: string
): Promise<ICustomer> => {
  const res: ICustomer = await installedRequest(
    client,
    domain,
    `customers/${id}`,
    "GET"
  );

  res.full_name = res.first_name + " " + res.last_name;

  return res;
};

export const getOrderById = async (
  client: IDeskproClient,
  domain: string,
  id: string
): Promise<IOrder> => {
  const res = await installedRequest(client, domain, `orders/${id}`, "GET");

  res.subtotal = res.total - res.shipping_total - res.total_tax;
  res.status = makeFirstLetterUppercase(res.status);

  return res;
};

export const getOrders = (
  client: IDeskproClient,
  domain: string
): Promise<IOrder[]> => {
  return installedRequest(client, domain, `orders`, "GET");
};

export const getOrdersByCustomerId = async (
  client: IDeskproClient,
  domain: string,
  customerId: string
): Promise<IOrder[]> => {
  const res = await installedRequest(
    client,
    domain,
    `orders?customer_id=${customerId}`,
    "GET"
  );

  return res.map((e: IOrder) => ({
    ...e,
    status: makeFirstLetterUppercase(e.status),
  }));
};

const installedRequest = async (
  client: IDeskproClient,
  domain: string,
  url: string,
  method: RequestMethod,
  data?: unknown
) => {
  const fetch = await proxyFetch(client);

  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Basic __consumer_key+':'+consumer_secret.base64__`,
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(
    `${domain}/wp-json/wc/v3/${url.trim()}`,
    options
  );

  if (isResponseError(response)) {
    throw new Error(
      JSON.stringify({
        status: response.status,
        message: await response.text(),
      })
    );
  }

  return response.json();
};

export const isResponseError = (response: Response) =>
  response.status < 200 || response.status >= 400;
