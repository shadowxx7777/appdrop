import { useEffect, useState } from "react";
import type { AppItem } from "../data/apps";
import { getLatestAppRelease, type AppRelease } from "./github-releases";

export type AppReleaseState = {
  release: AppRelease | null;
  loading: boolean;
  error: boolean;
};

export function useAppRelease(app: AppItem): AppReleaseState {
  const [state, setState] = useState<AppReleaseState>({
    release: null,
    loading: true,
    error: false,
  });

  useEffect(() => {
    let active = true;
    setState({ release: null, loading: true, error: false });

    getLatestAppRelease(app.releaseTagPrefix, app.releaseAssetName)
      .then((release) => {
        if (active) setState({ release, loading: false, error: false });
      })
      .catch(() => {
        if (active) setState({ release: null, loading: false, error: true });
      });

    return () => {
      active = false;
    };
  }, [app.releaseAssetName, app.releaseTagPrefix]);

  return state;
}
