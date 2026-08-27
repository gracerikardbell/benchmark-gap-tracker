import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { AppData, BenchmarkSettings, Initiative } from '../domain/types';
import { getSeedData, schemaVersion } from '../data/seed';

const STORAGE_KEY = 'benchmark-gap-tracker:data';

function loadInitialData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getSeedData();
    const parsed = JSON.parse(raw) as AppData;
    if (!parsed || parsed.schemaVersion !== schemaVersion) return getSeedData();
    return parsed;
  } catch {
    return getSeedData();
  }
}

interface AppStoreValue {
  data: AppData;
  addInitiative: (initiative: Initiative) => void;
  updateInitiative: (initiative: Initiative) => void;
  updateSettings: (settings: BenchmarkSettings) => void;
}

const AppStoreContext = createContext<AppStoreValue | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(loadInitialData);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const addInitiative = useCallback((initiative: Initiative) => {
    setData((prev) => ({ ...prev, initiatives: [...prev.initiatives, initiative] }));
  }, []);

  const updateInitiative = useCallback((initiative: Initiative) => {
    setData((prev) => ({
      ...prev,
      initiatives: prev.initiatives.map((i) => (i.id === initiative.id ? initiative : i)),
    }));
  }, []);

  const updateSettings = useCallback((settings: BenchmarkSettings) => {
    setData((prev) => ({ ...prev, settings }));
  }, []);

  const value = useMemo(
    () => ({ data, addInitiative, updateInitiative, updateSettings }),
    [data, addInitiative, updateInitiative, updateSettings],
  );

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore(): AppStoreValue {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error('useAppStore must be used within AppStoreProvider');
  return ctx;
}
