import { Music2, Pause, SkipForward, SkipBack } from "lucide-react";

interface AudioPlayerProps {
  audioRef: React.RefObject<HTMLAudioElement>;
  isPlaying: boolean;
  toggleAudio: () => void;
  currentSong: string;
  currentSongSrc: string;
  onPrevSong: () => void;
  onNextSong: () => void;
}

function AudioPlayer({
  audioRef,
  isPlaying,
  toggleAudio,
  currentSong,
  currentSongSrc,
  onPrevSong,
  onNextSong,
}: AudioPlayerProps) {
  return (
    <div className="bg-transparent fixed bottom-4 left-4 p-4 rounded-lg flex items-center blur-sm duration-500 hover:blur-none space-x-4">
      {/* Audio element with auto-looping */}
      <audio
        ref={audioRef}
        src={currentSongSrc}
        onEnded={() => {
          if (isPlaying) {
            audioRef.current?.play();
          }
        }}
      ></audio>

      <button className="text-orange-400" onClick={onPrevSong}>
        <SkipBack className="w-6 h-6" />
      </button>
      <button className="text-orange-400" onClick={toggleAudio}>
        {isPlaying ? (
          <Pause className="w-6 h-6" />
        ) : (
          <Music2 className="w-6 h-6 animate-pulse" />
        )}
      </button>
      <button className="text-orange-400" onClick={onNextSong}>
        <SkipForward className="w-6 h-6" />
      </button>

      <span className="text-white text-sm">{currentSong}</span>
    </div>
  );
}

export default AudioPlayer;
