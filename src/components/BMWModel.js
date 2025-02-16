'use client';

import React, { Suspense, useEffect, useRef, useMemo, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei';
import { easing } from 'maath';

/** 🎥 Camera Animation Component */
function CameraAnimation() {
  const { camera } = useThree();
  const progress = useRef(0);
  const startTime = useRef(null);
  const [animationDone, setAnimationDone] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      startTime.current = performance.now(); // Start animation after 5s
    }, 5000);
  }, []);

  useFrame(({ clock }) => {
    if (!startTime.current) return;

    const elapsed = (performance.now() - startTime.current) / 2500;
    progress.current = Math.min(elapsed, 1);

    /** Waypoints for Smooth Camera Movement */
    const waypoints = [
      [10, 12, -10], // Start
      [8, 10, -7],
      [6, 8, -4],
      [4, 6, -1],
      [2, 4, 2],
      [0, 3, 5], // Front
      [-2, 1, 4], // Slightly downward angle
    ];

    const index = Math.floor(progress.current * (waypoints.length - 1));
    const nextIndex = Math.min(index + 1, waypoints.length - 1);
    const t = progress.current * (waypoints.length - 1) - index;

    /** Smooth Lerp for Camera Movement */
    const targetPos = waypoints[index].map(
      (start, i) => start * (1 - t) + waypoints[nextIndex][i] * t,
    );

    easing.damp3(camera.position, targetPos, 0.15, progress.current);
    camera.lookAt(0, 0, 0);

    if (progress.current === 1 && !animationDone) {
      setTimeout(() => setAnimationDone(true), 1000); // Start breathing after 1s
    }

    /** 📌 Breathing Effect (Bigger & Smoother Oscillation) */
    if (animationDone) {
      const breatheAmount = Math.sin(clock.elapsedTime * 1.5) * 0.05; // Increased oscillation
      camera.position.y += breatheAmount;
      camera.lookAt(0, 0, 0); // Ensure focus remains on the model
    }
  });

  return null;
}

/** 🚗 BMW Model Component */
function BMWModel() {
  const { scene } = useGLTF('/models.glb');

  /** Optimize Model Processing with `useMemo` */
  useMemo(() => {
    scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;

        if (obj.material) {
          obj.material.envMapIntensity = 2;
          obj.material.metalness = 1;
          obj.material.roughness = 0.1;
        }

        /** Glass & Headlight Effects */
        if (
          obj.name.toLowerCase().includes('glass') ||
          obj.name.toLowerCase().includes('headlight')
        ) {
          obj.material.transparent = true;
          obj.material.opacity = 0.85;
          obj.material.ior = 1.5;
          obj.material.transmission = 0.9;
        }
      }
    });
  }, [scene]);

  return <primitive object={scene} scale={1} />;
}

export default function BMWViewer() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, clearColor: 'black' }}
      camera={{ position: [10, 12, -10], fov: 50 }}>
      <CameraAnimation />

      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 10, 5]} intensity={4} castShadow />

      <Environment preset='city' />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color='gray' roughness={0.5} metalness={0.3} />
      </mesh>

      <Suspense fallback={null}>
        <BMWModel />
      </Suspense>

      <OrbitControls enableZoom={true} />
    </Canvas>
  );
}

useGLTF.preload('/models.glb');
