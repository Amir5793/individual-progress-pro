"use client";
import React, { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const stableRandom = (seed) => {
  const value = Math.sin(seed) * 10000;
  return value - Math.floor(value);
};

const buildParticles = (count, width, height) => {
  return Array.from({ length: count }, (_, index) => {
    const seed = index + 13;
    return {
      t: stableRandom(seed + 1) * 100,
      speed: 0.01 + stableRandom(seed + 2) / 200,
      mx: (stableRandom(seed + 3) - 0.5) * width,
      my: (stableRandom(seed + 4) - 0.5) * height,
      mz: (stableRandom(seed + 5) - 0.5) * 10,
      cx: (stableRandom(seed + 3) - 0.5) * width,
      cy: (stableRandom(seed + 4) - 0.5) * height,
      cz: (stableRandom(seed + 5) - 0.5) * 10,
      randomRadiusOffset: (stableRandom(seed + 6) - 0.5) * 2,
    };
  });
};

const AntigravityInner = ({
  count = 120,
  magnetRadius = 6,
  ringRadius = 7,
  waveSpeed = 0.4,
  waveAmplitude = 1,
  particleSize = 1.2,
  lerpSpeed = 0.05,
  color = "#5227FF",
  autoAnimate = true,
  particleVariance = 1,
  rotationSpeed = 0,
  depthFactor = 1,
  pulseSpeed = 3,
  particleShape = "capsule",
  fieldStrength = 10,
}) => {
  const meshRef = useRef(null);
  const { viewport } = useThree();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const lastMousePos = useRef({ x: 0, y: 0 });
  const lastMouseMoveTime = useRef(0);
  const virtualMouse = useRef({ x: 0, y: 0 });

  // Rebuild particles when viewport changes to ensure they are within bounds
  const particles = useMemo(() => {
    return buildParticles(count, viewport.width, viewport.height);
  }, [count, viewport.width, viewport.height]);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const { pointer: m, clock } = state;

    // Detect mouse movement
    const mouseDist = Math.sqrt(
      Math.pow(m.x - lastMousePos.current.x, 2) +
      Math.pow(m.y - lastMousePos.current.y, 2),
    );

    if (mouseDist > 0.001) {
      lastMouseMoveTime.current = Date.now();
      lastMousePos.current = { x: m.x, y: m.y };
    }

    // Convert mouse -1:1 to world units
    let destX = (m.x * viewport.width) / 2;
    let destY = (m.y * viewport.height) / 2;

    // Idle animation
    if (autoAnimate && Date.now() - lastMouseMoveTime.current > 2000) {
      const time = clock.getElapsedTime();
      destX = Math.sin(time * 0.5) * (viewport.width / 4);
      destY = Math.cos(time * 0.5 * 2) * (viewport.height / 4);
    }

    const smoothFactor = 0.05;
    virtualMouse.current.x += (destX - virtualMouse.current.x) * smoothFactor;
    virtualMouse.current.y += (destY - virtualMouse.current.y) * smoothFactor;

    const time = clock.getElapsedTime();

    particles.forEach((particle, i) => {
      particle.t += particle.speed / 2;
      
      const dx = particle.mx - virtualMouse.current.x;
      const dy = particle.my - virtualMouse.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let targetX = particle.mx;
      let targetY = particle.my;
      let targetZ = particle.mz * depthFactor;

      if (dist < magnetRadius) {
        const angle = Math.atan2(dy, dx) + (time * rotationSpeed);
        const wave = Math.sin(particle.t * waveSpeed + angle) * (0.5 * waveAmplitude);
        const currentRingRadius = ringRadius + wave + (particle.randomRadiusOffset * (5 / (fieldStrength + 0.1)));

        targetX = virtualMouse.current.x + currentRingRadius * Math.cos(angle);
        targetY = virtualMouse.current.y + currentRingRadius * Math.sin(angle);
        targetZ = (particle.mz * depthFactor) + Math.sin(particle.t) * waveAmplitude;
      }

      particle.cx += (targetX - particle.cx) * lerpSpeed;
      particle.cy += (targetY - particle.cy) * lerpSpeed;
      particle.cz += (targetZ - particle.cz) * lerpSpeed;

      dummy.position.set(particle.cx, particle.cy, particle.cz);
      dummy.lookAt(virtualMouse.current.x, virtualMouse.current.y, particle.cz);
      dummy.rotateX(Math.PI / 2);

      const distFromRing = Math.abs(Math.sqrt(Math.pow(particle.cx - virtualMouse.current.x, 2) + Math.pow(particle.cy - virtualMouse.current.y, 2)) - ringRadius);
      let scale = Math.max(0.2, (1 - distFromRing / 10)) * particleSize;
      
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      {particleShape === "capsule" && <capsuleGeometry args={[0.1, 0.4, 4, 8]} />}
      {particleShape === "sphere" && <sphereGeometry args={[0.2, 16, 16]} />}
      {particleShape === "box" && <boxGeometry args={[0.3, 0.3, 0.3]} />}
      <meshBasicMaterial color={color} transparent opacity={0.8} />
    </instancedMesh>
  );
};

export default function Antigravity(props) {
  return (
    <div style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}>
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 0, 30], fov: 45 }}
          gl={{ alpha: true, antialias: true }}
          style={{ background: "transparent" }}
        >
          <AntigravityInner {...props} />
        </Canvas>
      </Suspense>
    </div>
  );
}