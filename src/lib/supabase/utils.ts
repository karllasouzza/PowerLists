import humps from 'humps';

export const convertToSupabaseFormat = (item: any) => {
  try {
    return humps.decamelizeKeys(item);
  } catch (error) {
    console.error('Error converting data to Supabase format:', error);
    return null;
  }
};

export const convertFromSupabaseFormat = (item: any) => {
  try {
    return humps.camelizeKeys(item);
  } catch (error) {
    console.error('Error converting data from Supabase format:', error);
    return null;
  }
};
