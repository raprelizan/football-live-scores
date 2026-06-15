import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Maximize, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoPlayerProps {
  streamUrl: string;
  title: string;
  qualityOptions?: Array<{
    quality: string;
    url: string;
    isDefault?: boolean;
  }>;
  onQualityChange?: (quality: string) => void;
}

export default function VideoPlayer({
  streamUrl,
  title,
  qualityOptions = [],
  onQualityChange,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentQuality, setCurrentQuality] = useState(
    qualityOptions[0]?.quality || "Auto"
  );
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Check if browser supports HLS
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
    } else if (typeof (window as any).HLS !== "undefined") {
      // Use HLS.js for browsers that don't support native HLS
      const hls = new (window as any).HLS();
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
    }

    return () => {
      if (video.src) {
        video.src = "";
      }
    };
  }, [streamUrl]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  };

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (!isFullscreen) {
        if (containerRef.current.requestFullscreen) {
          containerRef.current.requestFullscreen();
        }
      } else {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const handleQualityChange = (quality: string, url?: string) => {
    setCurrentQuality(quality);
    if (url && videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      videoRef.current.src = url;
      videoRef.current.currentTime = currentTime;
      if (isPlaying) {
        videoRef.current.play();
      }
    }
    setShowQualityMenu(false);
    onQualityChange?.(quality);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "00:00";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      ref={containerRef}
      className="w-full bg-black rounded-lg overflow-hidden group"
    >
      {/* Video Container */}
      <div className="relative w-full bg-black aspect-video">
        <video
          ref={videoRef}
          className="w-full h-full"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          controls={false}
        />

        {/* Controls Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold text-lg">{title}</h3>
            <span className="bg-red-600 text-white px-3 py-1 rounded text-sm font-bold">
              🔴 مباشر
            </span>
          </div>

          {/* Bottom Controls */}
          <div className="space-y-3">
            {/* Progress Bar */}
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleProgressChange}
                className="flex-1 h-1 bg-gray-600 rounded cursor-pointer accent-accent"
              />
              <span className="text-white text-xs whitespace-nowrap">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Play/Pause */}
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handlePlayPause}
                  className="text-white hover:bg-white/20"
                >
                  {isPlaying ? (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </Button>

                {/* Volume */}
                <div className="flex items-center gap-2 group/volume">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleMute}
                    className="text-white hover:bg-white/20"
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </Button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-0 group-hover/volume:w-20 transition-all duration-200 h-1 bg-gray-600 rounded cursor-pointer accent-accent"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Quality Settings */}
                <div className="relative">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setShowQualityMenu(!showQualityMenu)}
                    className="text-white hover:bg-white/20"
                  >
                    <Settings className="w-5 h-5" />
                  </Button>

                  {showQualityMenu && qualityOptions.length > 0 && (
                    <div className="absolute bottom-full right-0 mb-2 bg-gray-900 rounded-lg shadow-lg overflow-hidden z-50">
                      {qualityOptions.map((option) => (
                        <button
                          key={option.quality}
                          onClick={() =>
                            handleQualityChange(option.quality, option.url)
                          }
                          className={`block w-full px-4 py-2 text-left text-sm hover:bg-accent hover:text-black transition-colors ${
                            currentQuality === option.quality
                              ? "bg-accent text-black font-bold"
                              : "text-white"
                          }`}
                        >
                          {option.quality}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Fullscreen */}
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleFullscreen}
                  className="text-white hover:bg-white/20"
                >
                  <Maximize className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
