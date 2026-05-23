import { useState, useEffect } from 'react';
import { Model, Query } from '@nozbe/watermelondb';

export function useObservableQuery<T extends Model>(query: Query<T>): T[] {
  const [records, setRecords] = useState<T[]>([]);

  useEffect(() => {
    const subscription = query.observe().subscribe(setRecords);
    return () => subscription.unsubscribe();
  }, [query]);

  return records;
}
