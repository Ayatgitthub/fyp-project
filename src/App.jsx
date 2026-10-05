import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DbProvider, useDb } from './context/DbContext';
import Splash from './pages/Splash';
import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import Diseases from './pages/Diseases';
import DiseaseDetail from './pages/DiseaseDetail';
import Treatments from './pages/Treatments';
import Logs from './pages/Logs';
import QuranTracker from './pages/QuranTracker';

import './App.css';

function App() {

  return (
    <DbProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/welcome"
            element={
              <Splash />
            }
          />

          <Route
            path="/"
            element={<Navigate to="/welcome" replace />}
          />

          <Route
            path="/app"
            element={
              <MainLayout />
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="diseases" element={<Diseases />} />
            <Route path="diseases/:id" element={<DiseaseDetail />} />
            <Route path="treatments" element={<Treatments />} />
            <Route path="logs" element={<Logs />} />
            <Route path="quran-tracker" element={<QuranTracker />} />
          </Route>

          <Route path="*" element={<Navigate to="/welcome" replace />} />
        </Routes>
      </BrowserRouter>
    </DbProvider>
  );
}

export default App;
