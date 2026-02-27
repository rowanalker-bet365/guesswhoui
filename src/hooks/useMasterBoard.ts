import useSWR from 'swr';
import { ApiCharacter } from '@/types';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useMasterBoard = () => {
  const { data, error, isLoading } = useSWR<{ characters: ApiCharacter[] }>(
    '/api/game/master-board',
    fetcher,
    { refreshInterval: 2000 }
  );

  return {
    characters: data?.characters || [],
    isLoading,
    isError: error,
  };
};