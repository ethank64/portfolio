import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';

// Components
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import ProjectDetail from './pages/ProjectDetail';
import NotFound from './pages/NotFound';

const BackgroundScene = React.lazy(() => import('./components/BackgroundScene'));

const AppContent: React.FC = () => {
  const [showBackground, setShowBackground] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const timeout = window.setTimeout(() => setShowBackground(true), 600);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    if (state?.scrollTo) {
      const element = document.getElementById(state.scrollTo);
      if (element) {
        window.setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className="App">
      <Navigation />
      <Routes>
        <Route
          path="/"
          element={
            <div className="main-content">
              {showBackground && (
                <Suspense fallback={null}>
                  <BackgroundScene />
                </Suspense>
              )}

              <Hero />
              <About />
              <Projects />
              <Contact />
            </div>
          }
        />
        <Route path="/projects/:projectId" element={<ProjectDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
