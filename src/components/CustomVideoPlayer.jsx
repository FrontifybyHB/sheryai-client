import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import AppIcon from './AppIcon';

function fmtTime(seconds = 0) {
  const safe = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = Math.floor(safe % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

const CustomVideoPlayer = forwardRef(function CustomVideoPlayer(
  {
    src,
    title,
    className = '',
    onLoadedMetadata,
    onTimeUpdate,
    onError,
  },
  ref
) {
  const videoRef = useRef(null);
  const shellRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  useImperativeHandle(ref, () => videoRef.current);

  useEffect(() => {
    const handleFullscreen = () => setFullscreen(document.fullscreenElement === shellRef.current);
    document.addEventListener('fullscreenchange', handleFullscreen);
    return () => document.removeEventListener('fullscreenchange', handleFullscreen);
  }, []);

  useEffect(() => {
    setPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [src]);

  const togglePlay = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      await video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  const seek = (value) => {
    const video = videoRef.current;
    if (!video) return;
    const nextTime = Number(value);
    video.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const changeVolume = (value) => {
    const nextVolume = Number(value);
    const video = videoRef.current;
    setVolume(nextVolume);
    setMuted(nextVolume === 0);
    if (video) {
      video.volume = nextVolume;
      video.muted = nextVolume === 0;
    }
  };

  const toggleMuted = () => {
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setMuted(nextMuted);
    if (!nextMuted && video.volume === 0) {
      video.volume = 0.75;
      setVolume(0.75);
    }
  };

  const toggleFullscreen = async () => {
    if (!shellRef.current) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen?.();
    } else {
      await shellRef.current.requestFullscreen?.();
    }
  };

  return (
    <div ref={shellRef} className={`group relative h-full w-full overflow-hidden bg-black ${className}`}>
      <button type="button" aria-label={playing ? 'Pause video' : 'Play video'} onClick={togglePlay} className="absolute inset-0 z-10 cursor-pointer">
        <span className="sr-only">{playing ? 'Pause video' : 'Play video'}</span>
      </button>

      <video
        ref={videoRef}
        src={src}
        playsInline
        preload="metadata"
        title={title}
        className="block h-full w-full bg-black object-contain"
        onLoadedMetadata={(event) => {
          setDuration(event.currentTarget.duration || 0);
          onLoadedMetadata?.(event);
        }}
        onTimeUpdate={(event) => {
          setCurrentTime(event.currentTarget.currentTime || 0);
          onTimeUpdate?.(event);
        }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onError={onError}
      />

      {!playing && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-black/65 text-white shadow-2xl backdrop-blur">
            <AppIcon name="play" size={30} />
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-black via-black/82 to-transparent px-3 pb-3 pt-12 text-white opacity-100 transition sm:px-4">
        <input
          type="range"
          min="0"
          max={duration || 0}
          step="0.1"
          value={Math.min(currentTime, duration || currentTime)}
          onChange={(event) => seek(event.target.value)}
          aria-label="Video progress"
          className="mb-3 h-1.5 w-full cursor-pointer accent-accent"
        />

        <div className="flex items-center gap-2">
          <button type="button" onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/12 text-white transition hover:bg-white/20">
            <AppIcon name={playing ? 'pause' : 'play'} size={17} />
          </button>

          <span className="min-w-[86px] font-mono text-[11px] text-white/75">
            {fmtTime(currentTime)} / {fmtTime(duration)}
          </span>

          <div className="ml-auto flex items-center gap-2">
            <button type="button" onClick={toggleMuted} aria-label={muted ? 'Unmute' : 'Mute'} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/10 text-white transition hover:bg-white/20">
              <AppIcon name={muted ? 'volumeX' : 'volume'} size={16} />
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={muted ? 0 : volume}
              onChange={(event) => changeVolume(event.target.value)}
              aria-label="Video volume"
              className="hidden h-1 w-20 cursor-pointer accent-accent sm:block"
            />
            <button type="button" onClick={toggleFullscreen} aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/10 text-white transition hover:bg-white/20">
              <AppIcon name={fullscreen ? 'minimize' : 'maximize'} size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default CustomVideoPlayer;
