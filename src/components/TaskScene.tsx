"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import TaskSphere from "./TaskSphere";
import { useTaskStore } from "../store/taskStore";
import { useEffect, useMemo } from "react";
import type { Task } from "../types";

type FilterType = "all" | "completed" | "notCompleted";

interface TaskSceneProps {
  filterType: FilterType;
  onTaskClick: (task: Task) => void;
}

export default function TaskScene({ filterType, onTaskClick }: TaskSceneProps) {
  const tasks = useTaskStore((state) => state.tasks);

  const filteredTasks = useMemo(() => {
    switch (filterType) {
      case "completed":
        return tasks.filter((task) => task.completed);
      case "notCompleted":
        return tasks.filter((task) => !task.completed);
      default:
        return tasks;
    }
  }, [tasks, filterType]);

  useEffect(() => {
    console.log("Filtered tasks:", filteredTasks);
  }, [filteredTasks]);

  return (
    <div className="fixed inset-0 w-screen h-screen z-0">
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        {filteredTasks.map((task) => (
          <TaskSphere key={task.id} task={task} onTaskClick={onTaskClick} />
        ))}
        <OrbitControls
          enablePan={false}
          enableRotate={true}
          enableZoom={true}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 1.5}
        />
        <EffectComposer>
          <Bloom
            intensity={1.0}
            luminanceThreshold={0.1}
            luminanceSmoothing={0.3}
            radius={0.3}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
