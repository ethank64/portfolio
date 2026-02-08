import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import ProjectDetail from './pages/ProjectDetail';

const BackgroundScene = React.lazy(() => import('./components/BackgroundScene'));

function App() {
  const [showBackground, setShowBackground] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setShowBackground(true), 600);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <Router>
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
