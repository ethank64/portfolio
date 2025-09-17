import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

const Background3D: React.FC = () => {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group>
      {/* Floating geometric shapes */}
      <mesh ref={meshRef} position={[2, 1, -2]}>
        <octahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial 
          color="#667eea" 
          transparent 
          opacity={0.3}
          wireframe
        />
      </mesh>
      
      <mesh position={[-2, -1, -3]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial 
          color="#764ba2" 
          transparent 
          opacity={0.2}
          wireframe
        />
      </mesh>
      
      <mesh position={[0, 2, -4]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial 
          color="#f093fb" 
          transparent 
          opacity={0.4}
          wireframe
        />
      </mesh>

      {/* Ambient light for subtle illumination */}
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#667eea" />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#764ba2" />
    </group>
  );
};

export default Background3D;
