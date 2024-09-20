export type CategoryItem = {
  code: string;
  count: number;
  externalId: string;
  id: string;
  name: string;
  sectionCode: string;
  children?: CategoryItem[];
};
