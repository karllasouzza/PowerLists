import humps from 'humps';

export const convertToSupabaseFormat = (item: any) => {
  return humps.decamelizeKeys(item);
};

export const convertFromSupabaseFormat = (item: any) => {
  return humps.camelizeKeys(item);
};
