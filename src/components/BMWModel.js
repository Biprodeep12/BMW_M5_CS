'use client';

import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei';
import { easing } from 'maath';

function CameraAnimation() {
  const { camera } = useThree();
  const progress = useRef(0);
  const startTime = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      startTime.current = performance.now(); // Start animation after 5s
    }, 5000);
  }, []);

  useFrame(() => {
    if (startTime.current) {
      const elapsed = (performance.now() - startTime.current) / 2000;
      progress.current = Math.min(elapsed, 1);

      let waypoints = [
        [10, 12, -10],
        [8, 10, -7],
        [6, 8, -4],
        [4, 6, -1],
        [2, 4, 2],
        [0, 3, 5],
        [-2, 1, 4],
      ];

      let index = Math.floor(progress.current * (waypoints.length - 1));
      let nextIndex = Math.min(index + 1, waypoints.length - 1);
      let t = progress.current * (waypoints.length - 1) - index;

      let targetPos = [
        waypoints[index][0] * (1 - t) + waypoints[nextIndex][0] * t,
        waypoints[index][1] * (1 - t) + waypoints[nextIndex][1] * t,
        waypoints[index][2] * (1 - t) + waypoints[nextIndex][2] * t,
      ];

      easing.damp3(camera.position, targetPos, 0.2, progress.current);

      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    }
  });

  return null;
}

export default function BMWViewer() {
  const { scene } = useGLTF('/models.glb');

  scene.traverse((obj) => {
    if (obj.isMesh) {
      obj.castShadow = true;
      obj.receiveShadow = true;
      obj.geometry.computeVertexNormals();

      if (obj.material) {
        obj.material.envMapIntensity = 2;
        obj.material.metalness = 1;
        obj.material.roughness = 0.1;
      }

      if (
        obj.name.toLowerCase().includes('glass') ||
        obj.name.toLowerCase().includes('headlight')
      ) {
        obj.material.transparent = true;
        obj.material.opacity = 0.8;
        obj.material.ior = 1.5;
        obj.material.transmission = 0.9;
      }
    }
  });

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, clearColor: 'black' }} // Solid background
      camera={{ position: [10, 10, -10], fov: 50 }} // Start from top
    >
      {/* Cinematic Camera Animation */}
      <CameraAnimation />

      {/* Lighting */}
      <ambientLight intensity={1} />
      <directionalLight position={[10, 10, 10]} intensity={5} castShadow />

      {/* Reflections without HDRI background */}
      <Environment preset='city' />

      {/* Ground Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color='gray' roughness={0.5} metalness={0.3} />
      </mesh>

      {/* Load Model */}
      <Suspense fallback={null}>
        <primitive object={scene} scale={1} />
      </Suspense>

      {/* Controls */}
      <OrbitControls enableZoom={true} />
    </Canvas>
  );
}

useGLTF.preload('/models.glb');
