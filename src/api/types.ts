/* eslint-disable @typescript-eslint/no-explicit-any */
export type RequestMethod = "GET" | "POST" | "PATCH" | "DELETE";

export type APIArrayReturnTypes = any;

export interface ICustomer {
  id: number;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  username: string;
  billing: Ing;
  shipping: Ing;
  is_paying_customer: boolean;
  avatar_url: string;
  meta_data: MetaDatum[];
  _links: Links;
  full_name: string;
  total_spent: number;
  currency: string;
}

export interface Links {
  self: Collection[];
  collection: Collection[];
}

export interface Collection {
  href: string;
}

export interface Ing {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  postcode: string;
  country: string;
  state: string;
  email?: string;
  phone: string;
}

export interface MetaDatum {
  id: number;
  key: string;
  value: ValueClass | string;
}

export interface ValueClass {
  ID?: number;
  login?: string;
  email?: string;
  url?: string;
  first_name?: string;
  last_name?: string;
  display_name?: string;
  description?: string;
  two_step_enabled?: boolean;
  external_user_id?: number;
  ip?: string;
  side?: string;
  normal?: string;
  advanced?: string;
}

export interface IOrder {
  id: number;
  parent_id: number;
  status: string;
  currency: string;
  version: string;
  prices_include_tax: boolean;
  date_created: string;
  date_modified: string;
  discount_total: string;
  discount_tax: string;
  shipping_total: string;
  shipping_tax: string;
  cart_tax: string;
  total: string;
  total_tax: string;
  customer_id: number;
  order_key: string;
  billing: Ing;
  shipping: Ing;
  payment_method: string;
  payment_method_title: string;
  transaction_id: string;
  customer_ip_address: string;
  customer_user_agent: string;
  created_via: string;
  customer_note: string;
  date_completed: null;
  date_paid: string;
  cart_hash: string;
  number: string;
  meta_data: MetaDatum[];
  line_items: LineItem[];
  tax_lines: any[];
  shipping_lines: any[];
  fee_lines: any[];
  coupon_lines: any[];
  refunds: any[];
  payment_url: string;
  is_editable: boolean;
  needs_payment: boolean;
  needs_processing: boolean;
  date_created_gmt: string;
  date_modified_gmt: string;
  date_completed_gmt: null;
  date_paid_gmt: string;
  gift_cards: any[];
  currency_symbol: string;
  _links: Links;
}

export interface Links {
  self: Collection[];
  collection: Collection[];
  customer: Collection[];
}

export interface Collection {
  href: string;
}

export interface Ing {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email?: string;
  phone: string;
}

export interface LineItem {
  id: number;
  name: string;
  product_id: number;
  variation_id: number;
  quantity: number;
  tax_class: string;
  subtotal: string;
  subtotal_tax: string;
  total: string;
  total_tax: string;
  taxes: any[];
  meta_data: any[];
  sku: string;
  price: number;
  image: Image;
  parent_name: null;
  bundled_by: string;
  bundled_item_title: string;
  bundled_items: any[];
}

export interface Image {
  id: string;
  src: string;
}

export interface MetaDatum {
  id: number;
  key: string;
}

export interface INote {
  id: number;
  author: string;
  date_created: string;
  date_created_gmt: string;
  note: string;
  customer_note: boolean;
  _links: Links;
}

export interface Links {
  self: Collection[];
  collection: Collection[];
  up: Collection[];
}

export interface Collection {
  href: string;
}
