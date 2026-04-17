"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";

const COUNT = 2400;
const CLAUDE = new THREE.Color("#D97757");
const CLAUDE_DEEP = new THREE.Color("#C15F3C");
const CLAUDE_LIGHT = new THREE.Color("#F2C7AF");

type ProgressRef = MutableRefObject<number>;

function fibonacciSphere(count: number, radius: number) {
  const arr = new Float32Array(count * 3);
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    arr[i * 3] = Math.cos(theta) * r * radius;
    arr[i * 3 + 1] = y * radius;
    arr[i * 3 + 2] = Math.sin(theta) * r * radius;
  }
  return arr;
}

function ringCluster(count: number, radius: number) {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const ring = i % 3;
    const theta = (i / count) * Math.PI * 10;
    const tilt = ring === 0 ? 0 : ring === 1 ? Math.PI / 3 : -Math.PI / 3;
    const r = radius * (1 + ring * 0.18);
    const x = Math.cos(theta) * r;
    const y = Math.sin(theta) * r * Math.cos(tilt);
    const z = Math.sin(theta) * r * Math.sin(tilt);
    const jitter = (Math.random() - 0.5) * 0.08;
    arr[i * 3] = x + jitter;
    arr[i * 3 + 1] = y + jitter;
    arr[i * 3 + 2] = z + jitter;
  }
  return arr;
}

function coreCluster(count: number, radius: number) {
  // Tight, slightly spiraled core — particles condensing before the burst.
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = i / count;
    const spiral = t * Math.PI * 14;
    const r = radius * (0.05 + Math.random() * 0.35);
    const y = (Math.random() - 0.5) * radius * 0.35;
    arr[i * 3] = Math.cos(spiral) * r + (Math.random() - 0.5) * 0.05;
    arr[i * 3 + 1] = y + (Math.random() - 0.5) * 0.05;
    arr[i * 3 + 2] = Math.sin(spiral) * r + (Math.random() - 0.5) * 0.05;
  }
  return arr;
}

function ParticleCloud({ progressRef }: { progressRef: ProgressRef }) {
  const pointsRef = useRef<THREE.Points>(null!);
  const materialRef = useRef<THREE.PointsMaterial>(null!);
  const sphere = useMemo(() => fibonacciSphere(COUNT, 1.25), []);
  const rings = useMemo(() => ringCluster(COUNT, 1.9), []);
  const core = useMemo(() => coreCluster(COUNT, 1.0), []);
  const positions = useMemo(() => new Float32Array(sphere), [sphere]);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  const tmpColor = useMemo(() => new THREE.Color(), []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const p = progressRef.current;

    // Phase A — sphere forms into orbital rings.
    const phaseA = THREE.MathUtils.smoothstep(p, 0.08, 0.5);
    // Phase B — rings condense into a glowing core.
    const phaseB = THREE.MathUtils.smoothstep(p, 0.55, 0.82);
    // Phase C — core shatters outward (the burst).
    const phaseC = THREE.MathUtils.smoothstep(p, 0.82, 1.0);

    const wobble = 0.35 + phaseA * 0.9 + phaseB * 0.4;
    const posArr = geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3;
      // sphere → rings
      const ax = THREE.MathUtils.lerp(sphere[ix], rings[ix], phaseA);
      const ay = THREE.MathUtils.lerp(sphere[ix + 1], rings[ix + 1], phaseA);
      const az = THREE.MathUtils.lerp(sphere[ix + 2], rings[ix + 2], phaseA);
      // rings → core
      let bx = THREE.MathUtils.lerp(ax, core[ix], phaseB);
      let by = THREE.MathUtils.lerp(ay, core[ix + 1], phaseB);
      let bz = THREE.MathUtils.lerp(az, core[ix + 2], phaseB);
      // core → exploded outward
      if (phaseC > 0) {
        const len = Math.hypot(bx, by, bz) || 1;
        const explodeR = 1 + phaseC * 3.2;
        bx = (bx / len) * (len * explodeR);
        by = (by / len) * (len * explodeR);
        bz = (bz / len) * (len * explodeR);
      }
      const nx = Math.sin(t * 0.9 + i * 0.13) * 0.035 * wobble;
      const ny = Math.cos(t * 0.7 + i * 0.09) * 0.035 * wobble;
      const nz = Math.sin(t * 1.1 + i * 0.17) * 0.035 * wobble;
      posArr[ix] = bx + nx;
      posArr[ix + 1] = by + ny;
      posArr[ix + 2] = bz + nz;
    }
    geometry.attributes.position.needsUpdate = true;

    pointsRef.current.rotation.y = t * 0.18 + phaseA * 0.5;
    pointsRef.current.rotation.x = Math.sin(t * 0.14) * 0.2 + phaseB * 0.25;
    pointsRef.current.scale.setScalar(1 + phaseA * 0.1 + phaseB * 0.08);

    // Color shifts deeper toward the flash.
    tmpColor.copy(CLAUDE);
    tmpColor.lerp(CLAUDE_LIGHT, Math.min(1, phaseB + phaseC * 1.5));
    materialRef.current.color.copy(tmpColor);
    materialRef.current.opacity = 0.95 - phaseC * 0.4;
    materialRef.current.size = 0.024 + phaseB * 0.015 + phaseC * 0.04;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        ref={materialRef}
        size={0.024}
        color={CLAUDE}
        transparent
        opacity={0.95}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

function GlowCore({ progressRef }: { progressRef: ProgressRef }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const p = progressRef.current;
    const phaseB = THREE.MathUtils.smoothstep(p, 0.5, 0.82);
    const phaseC = THREE.MathUtils.smoothstep(p, 0.78, 1.0);
    const pulse = 0.9 + Math.sin(t * 1.2) * 0.08;
    const flash = Math.pow(phaseC, 1.7) * 6;
    ref.current.scale.setScalar(0.45 * pulse + phaseB * 0.4 + flash);
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.25 + phaseB * 0.55 + phaseC * 0.7;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshBasicMaterial
        color={CLAUDE_DEEP}
        transparent
        opacity={0.25}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

function OrbitRing({
  progressRef,
  speed,
  tilt,
  radius,
}: {
  progressRef: ProgressRef;
  speed: number;
  tilt: number;
  radius: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const p = progressRef.current;
    const phaseA = THREE.MathUtils.smoothstep(p, 0.18, 0.55);
    const phaseB = THREE.MathUtils.smoothstep(p, 0.5, 0.82);
    const phaseC = THREE.MathUtils.smoothstep(p, 0.82, 1.0);
    ref.current.rotation.x = tilt + t * speed * 0.2 + phaseB * speed;
    ref.current.rotation.y = t * speed * 0.4 + phaseA * Math.PI * 0.4;
    ref.current.scale.setScalar(1 - phaseB * 0.4 + phaseC * 2.2);
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = phaseA * 0.85 * (1 - phaseC);
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, 0.006, 6, 160]} />
      <meshBasicMaterial
        color={CLAUDE}
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

export function IntroScene({ progressRef }: { progressRef: ProgressRef }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 4.2], fov: 55 }}
      gl={{ antialias: true, alpha: false }}
    >
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#000000", 4, 9]} />
      <ambientLight intensity={0.15} />
      <GlowCore progressRef={progressRef} />
      <ParticleCloud progressRef={progressRef} />
      <OrbitRing progressRef={progressRef} speed={0.5} tilt={0.25} radius={1.6} />
      <OrbitRing progressRef={progressRef} speed={-0.7} tilt={-0.9} radius={1.75} />
      <OrbitRing progressRef={progressRef} speed={0.35} tilt={1.4} radius={1.9} />
    </Canvas>
  );
}
