/**
 * Registry of "refresh" callbacks exposed by the screens that display persisted
 * data. This mirrors the pattern already used by CreateTaskModal (its
 * `onSuccess={refresh}` prop): whoever mutates the data calls the screen's
 * refresh function right after the write succeeds, instead of relying on
 * navigation focus events.
 */
type Refresher = () => void | Promise<void>;

const refreshers = new Set<Refresher>();

export function registerScreenRefresher(refresher: Refresher): () => void {
  refreshers.add(refresher);
  return () => {
    refreshers.delete(refresher);
  };
}

export async function refreshRegisteredScreens(): Promise<void> {
  await Promise.all([...refreshers].map((refresh) => Promise.resolve(refresh())));
}
