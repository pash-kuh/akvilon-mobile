export type Contact = {
  address: string;
  city: {
    code: string;
    id: string;
    name: string;
  };
  coordinates: {
    lat: string;
    lon: string;
  };
  email: string;
  id: string;
  mainOffice: boolean;
  paymentMethods: {
    cash: boolean;
    mastercard: boolean;
    visa: boolean;
  };
  phones: Array<string>;
  schedule: Array<string>;

  image: object;
};

export type ContactsArray = {
  currentContact: string;
  contactsArray: Contact[];
};
