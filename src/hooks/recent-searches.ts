import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie, setCookie } from 'cookies-next';

export const useSaveQueryOnRecentSearches = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (element: CityFromSearch | User | Country) => {
      const search = {
        element,
        date: new Date().getTime(),
      };

      let recentSearches = (JSON.parse(getCookie('bagg.recent-searches') || '[]') ||
        []) as (typeof search)[];

      const elementPositionInArray = recentSearches.findIndex(
        (recentSearch) =>
          JSON.stringify(recentSearch.element) === JSON.stringify(element),
      );

      if (elementPositionInArray >= 0) {
        const element = recentSearches[elementPositionInArray];
        recentSearches.splice(elementPositionInArray, 1);
        recentSearches.splice(0, 0, element);
      } else {
        recentSearches = [search, ...recentSearches].slice(0, 10);
      }

      return recentSearches;
    },
    onSuccess(recentSearches) {
      setCookie('bagg.recent-searches', JSON.stringify(recentSearches));

      queryClient.setQueryData<RecentSearch[]>(
        ['recent-searches'],
        recentSearches.map((recentSearch) => {
          return {
            element: recentSearch.element,
            date: new Date(recentSearch.date),
          };
        }),
      );
    },
  });
};

export const useDeleteQueryFromRecentSearches = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (index: number) =>
      (queryClient.getQueryData<RecentSearch[]>(['recent-searches']) || []).filter(
        (_, i) => i !== index,
      ),
    onSuccess: (newRecentSearches) => {
      queryClient.setQueryData<RecentSearch[]>(['recent-searches'], newRecentSearches);

      setCookie('bagg.recent-searches', JSON.stringify(newRecentSearches));
    },
  });
};

export const useClearRecentSearches = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => [],
    onSuccess: (newRecentSearches) => {
      queryClient.setQueryData<RecentSearch[]>(['recent-searches'], newRecentSearches);

      setCookie('bagg.recent-searches', JSON.stringify(newRecentSearches));
    },
  });
};
