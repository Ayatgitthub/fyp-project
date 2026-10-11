import { createContext, useContext, useEffect, useMemo, useState } from "react";
import initSqlJs from "sql.js";

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
          locateFile: (file) =>
            `https://cdn.jsdelivr.net/npm/sql.js@1.14.1/dist/${file}`,
        });

        let response = await fetch("/database.sqlite");
        if (!response.ok) {
          response = await fetch("/quraan.sqlite");
        }
        if (!response.ok) {
          throw new Error(
            `Failed to load database: ${response.status} ${response.statusText}`,
          );
        }

        const buffer = await response.arrayBuffer();
        database = new SQL.Database(new Uint8Array(buffer));

        // Create quran_tracker_treatments table if it doesn't exist
        database.run(`
          CREATE TABLE IF NOT EXISTS quran_tracker_treatments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            disease_name TEXT NOT NULL,
            source TEXT NOT NULL,
            surahs TEXT,
            hadith_book TEXT,
            hadith_number TEXT,
            darood_name TEXT,
            darood_number TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

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

  // Save treatment to database
  const saveTreatment = (treatment) => {
    if (!db) return;

    const stmt = db.prepare(`
      INSERT INTO quran_tracker_treatments 
      (disease_name, source, surahs, hadith_book, hadith_number, darood_name, darood_number)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run([
      treatment.diseaseName,
      treatment.source,
      treatment.surahs ? JSON.stringify(treatment.surahs) : null,
      treatment.hadithBook || null,
      treatment.hadithNumber || null,
      treatment.daroodName || null,
      treatment.daroodNumber || null,
    ]);

    stmt.free();
  };

  // Load all treatments from database
  const loadTreatments = () => {
    if (!db) return [];

    const stmt = db.prepare("SELECT * FROM quran_tracker_treatments ORDER BY created_at DESC");
    const results = [];

    while (stmt.step()) {
      const row = stmt.getAsObject();
      results.push({
        id: row.id,
        diseaseName: row.disease_name,
        source: row.source,
        surahs: row.surahs ? JSON.parse(row.surahs) : [],
        hadithBook: row.hadith_book,
        hadithNumber: row.hadith_number,
        daroodName: row.darood_name,
        daroodNumber: row.darood_number,
      });
    }

    stmt.free();
    return results;
  };

  // Delete treatment from database
  const deleteTreatment = (id) => {
    if (!db) return;

    const stmt = db.prepare("DELETE FROM quran_tracker_treatments WHERE id = ?");
    stmt.run([id]);
    stmt.free();
  };

  const value = useMemo(() => ({ 
    db, 
    dbError,
    saveTreatment,
    loadTreatments,
    deleteTreatment,
  }), [db, dbError]);

  return <DbContext.Provider value={value}>{children}</DbContext.Provider>;
};

export const useDb = () => {
  const context = useContext(DbContext);
  if (context === null) {
    throw new Error("useDb must be used within DbProvider");
  }
  return context;
};
