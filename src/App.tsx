import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import './App.css';

// Components
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Background3D from './components/Background3D';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={
            <div className="main-content">
              <Canvas
                camera={{ position: [0, 0, 5], fov: 75 }}
                style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}
              >
                <Environment preset="sunset" />
                <Background3D />
                <OrbitControls enableZoom={false} enablePan={false} />
              </Canvas>

              <Hero />
              <About />
              <Projects />
              <Contact />
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;