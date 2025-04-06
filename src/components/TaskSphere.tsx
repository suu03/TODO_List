"use client";

import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import type { ThreeEvent } from "@react-three/fiber";
import type { Task } from "../types";
import * as THREE from "three";
import { useTaskStore } from "../store/taskStore";

interface TaskSphereProps {
  task: Task;
  onTaskClick: (task: Task) => void;
}

export default function TaskSphere({ task, onTaskClick }: TaskSphereProps) {
  const [hovered, setHovered] = useState(false);
  const { viewport } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const { categories } = useTaskStore();

  // Generate random initial position and size
  const randomPosition = useRef([
    (Math.random() - 0.5) * viewport.width,
    (Math.random() - 0.5) * viewport.height,
    0,
  ]);
  const randomScale = useRef(Math.random() * 0.5 + 0.5);
  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      onTaskClick(task);
    },
    [onTaskClick, task]
  );

  // Get category color based on category name
  const getCategoryColor = useCallback(
    (categoryName: string) => {
      const category = categories.find((cat) => cat.name === categoryName);
      return category ? category.color : "#FF5733"; // Default color if category not found
    },
    [categories]
  );

  // Convert hex color to THREE.Color
  // Use category color instead of task color
  const taskColor = useMemo(() => {
    const categoryColor = getCategoryColor(task.categoryId);
    return new THREE.Color(categoryColor);
  }, [task.categoryId, getCategoryColor]);

  const glowColor = useMemo(
    () => taskColor.clone().multiplyScalar(1.3),
    [taskColor]
  );

  // Floating animation
  const floatSpeed = useRef(Math.random() * 0.02 + 0.001); // Random speed
  const floatAmplitude = useRef(Math.random() * 0.2 + 0.1); // Random amplitude
  const initialY = useRef(randomPosition.current[1]);
  const time = useRef(Math.random() * 100);

  // Light up effect when completed
  const [emissiveIntensity, setEmissiveIntensity] = useState(
    task.completed ? 1.5 : 0.2
  );

  useEffect(() => {
    setEmissiveIntensity(task.completed ? 1.0 : hovered ? 0.2 : 0.1);
  }, [task.completed, hovered]);

  const AnimatedMesh = animated.mesh;

  // Add new spring for inner glow with smaller scale
  const { innerGlowScale, innerGlowOpacity } = useSpring({
    innerGlowScale: task.completed ? 1.0 : 1.0,
    innerGlowOpacity: task.completed ? 0.2 : 0.1,
    config: {
      tension: 100,
      friction: 10,
      mass: 10,
    },
  });

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Floating animation
      time.current += floatSpeed.current;
      groupRef.current.position.y =
        initialY.current + Math.sin(time.current) * floatAmplitude.current;

      // Reduced pulse animation scale for completed tasks
      if (task.completed) {
        const pulseScale = 1 + Math.sin(clock.getElapsedTime() * 1.5) * 0.015;
        groupRef.current.scale.setScalar(randomScale.current * pulseScale);
      }
    }
  });

  return (
    <group
      position={
        [
          randomPosition.current[0],
          initialY.current,
          randomPosition.current[2],
        ] as [number, number, number]
      }
      ref={groupRef}
      scale={randomScale.current}
    >
      {/* glow layer with reduced scale */}
      <AnimatedMesh scale={innerGlowScale}>
        <sphereGeometry args={[1, 64, 64]} />
        <animated.meshBasicMaterial
          color={glowColor}
          transparent={true}
          opacity={innerGlowOpacity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </AnimatedMesh>

      {/* Ambient glow layer with reduced scale */}
      {task.completed && (
        <mesh scale={1.05}>
          {" "}
          <sphereGeometry args={[1, 64, 64]} />
          <meshBasicMaterial
            color={glowColor}
            transparent={true}
            opacity={1.1}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Main sphere */}
      <mesh
        onClick={handleClick}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          setHovered(false);
        }}
      >
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color={taskColor}
          distort={task.completed ? 0.05 : 0}
          speed={task.completed ? 1.5 : 0}
          radius={1}
          roughness={0.1}
          metalness={0.9}
          clearcoat={1}
          clearcoatRoughness={0.1}
          emissive={taskColor}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
    </group>
  );
}
