import { useLocalStorage } from "./useLocalStorage";

const MAX_RECENT = 6;

export function useRecentlyViewed() {
  const [ids, setIds] = useLocalStorage<number[]>(
    "urban-mart-recently-viewed",
    [],
  );

  const trackView = (productId: number) => {
    setIds((prev) => {
      const next = [productId, ...prev.filter((id) => id !== productId)];
      return next.slice(0, MAX_RECENT);
    });
  };

  return { ids, trackView };
}
