export type PersonalizationJSON = {
  to: { email: string }[];
  cc?: { email: string }[];
  bcc?: { email: string }[];
};
