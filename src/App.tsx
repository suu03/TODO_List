"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import TaskScene from "./components/TaskScene";
import { DropdownMenu, DropdownItem } from "./components/DropdownMenu";
import { Plus } from "lucide-react";
import { useTaskStore } from "./store/taskStore";
import AudioPlayer from "./components/AudioPlayer";
import TaskModal from "./components/TaskModal";
import type { Task } from "./types";

type FilterType = "all" | "completed" | "notCompleted";

const songs = [
  { title: "lofi1", src: "/music/lofi1.mp3" },
  { title: "LoFi Sweet song", src: "/music/LoFi Sweet song.mp3" },
  { title: "a cooooool lofi beat", src: "/music/a cooooool lofi beat.mp3" },
];

function App() {
  const [filterType, setFilterType] = useState<FilterType>("all");
  const { setSelectedTask } = useTaskStore();
  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const switchToNextSong = () => {
    const newIndex = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(newIndex);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = songs[newIndex].src;
      audioRef.current.load();
      setTimeout(() => {
        audioRef.current
          ?.play()
          .catch((error) => console.warn("Playback interrupted", error));
      }, 100);
    }

    setIsPlaying(true);
  };

  const switchToPrevSong = () => {
    const newIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    setCurrentSongIndex(newIndex);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = songs[newIndex].src;
      audioRef.current.load();
      setTimeout(() => {
        audioRef.current
          ?.play()
          .catch((error) => console.warn("Playback interrupted", error));
      }, 100);
    }

    setIsPlaying(true);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onended = () => {
        if (isPlaying) {
          audioRef.current?.play(); // Auto-loop if playing
        }
      };
    }
  }, [isPlaying]);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current
          .play()
          .catch((error) => console.warn("Playback interrupted", error));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleCreateTask = () => {
    setSelectedTask(null);
    setIsAddingTask(true);
    setIsTaskModalVisible(true);
  };

  const handleTaskClick = useCallback(
    (task: Task) => {
      setSelectedTask(task);
      setIsAddingTask(false);
      setIsTaskModalVisible(true);
    },
    [setSelectedTask]
  );

  const handleCloseTaskModal = () => {
    setIsTaskModalVisible(false);
    setIsAddingTask(false);
    setSelectedTask(undefined);
  };

  return (
    <div className="h-screen flex flex-col relative">
      <header className="text-white p-4 flex justify-between items-center bg-transparent z-10 absolute w-full">
        <h1 className="text-2xl font-bold">TODO_List</h1>
        <DropdownMenu
          trigger={
            <button className="text-orange-400 p-2 bg-inherit w-24 blur-sm hover:blur-none rounded-full transition-all duration-500">
              Menu
            </button>
          }
          align="right"
        >
          <DropdownItem onClick={handleCreateTask}>
            <Plus size={16} className="inline mr-2" />
            Create Task
          </DropdownItem>
          <DropdownItem onClick={() => setFilterType("all")}>
            All Tasks
          </DropdownItem>
          <DropdownItem onClick={() => setFilterType("completed")}>
            Completed Tasks
          </DropdownItem>
          <DropdownItem onClick={() => setFilterType("notCompleted")}>
            Not Completed Tasks
          </DropdownItem>
        </DropdownMenu>
      </header>

      <main className="flex-grow flex relative h-full w-full">
        <TaskScene filterType={filterType} onTaskClick={handleTaskClick} />
        <AudioPlayer
          audioRef={audioRef}
          isPlaying={isPlaying}
          toggleAudio={toggleAudio}
          currentSong={songs[currentSongIndex].title}
          currentSongSrc={songs[currentSongIndex].src}
          onPrevSong={switchToPrevSong}
          onNextSong={switchToNextSong}
        />
        {isTaskModalVisible && (
          <TaskModal
            onClose={handleCloseTaskModal}
            isAddingTask={isAddingTask}
          />
        )}
      </main>
    </div>
  );
}

export default App;
