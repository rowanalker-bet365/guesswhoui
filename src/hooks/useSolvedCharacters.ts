import useSWR from 'swr';
import Cookies from 'js-cookie';
import { ApiCharacter } from '@/types';

const fetcher = (url: string) => {
  const teamId = Cookies.get('teamId');
  return fetch(url, {
    headers: {
      'X-Team-Id': teamId || '',
    },
  }).then((res) => res.json());
};

export const useSolvedCharacters = () => {
  const { data, error, isLoading } = useSWR<{ solvedCharacters: ApiCharacter[] }>(
    '/api/team/solved',
    fetcher
  );

  return {
    solvedCharacters: data?.solvedCharacters || [],
    isLoading,
    isError: error,
  };
};