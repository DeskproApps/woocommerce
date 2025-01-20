export interface ISettings {
  consumer_key?: string;
  consumer_secret?: string;
  store_url?: string;
}

export interface DPUser {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  titlePrefix: string;
  isDisabled: boolean;
  isAgent: boolean;
  isConfirmed: boolean;
  emails: string[];
  primaryEmail: string;
  customFields: Record<string, unknown>;
  language: string;
  locale: string;
};


export interface UserData {
  user:DPUser
}