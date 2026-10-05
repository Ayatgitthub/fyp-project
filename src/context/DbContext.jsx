import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import initSqlJs from 'sql.js';

const DbContext = createContext(null);

export const DbProvider = ({ children }) => {
  const [db, setDb] = useState(null);
  const [dbError, setDbError] = useState(null);

  useEffect(() => {
    let canceled = false;
    let database = null;

    const loadDatabase = async () => {
      try {
        const SQL = await initSqlJs({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/sql.js@1.14.1/dist/${file}`,
        });

        const response = await fetch('/database.sqlite');
        if (!response.ok) {
          throw new Error(`Failed to load database: ${response.status} ${response.statusText}`);
        }

        const buffer = await response.arrayBuffer();
        database = new SQL.Database(new Uint8Array(buffer));

        if (!canceled) {
          setDb(database);
        }
      } catch (error) {
        if (!canceled) {
          setDbError(error instanceof Error ? error.message : String(error));
        }
      }
    };

    loadDatabase();

    return () => {
      canceled = true;
      if (database) {
        database.close();
      }
    };
  }, []);

  const value = useMemo(() => ({ db, dbError }), [db, dbError]);

  return <DbContext.Provider value={value}>{children}</DbContext.Provider>;
};

export const useDb = () => {
  const context = useContext(DbContext);
  if (context === null) {
    throw new Error('useDb must be used within DbProvider');
  }
  return context;
};
