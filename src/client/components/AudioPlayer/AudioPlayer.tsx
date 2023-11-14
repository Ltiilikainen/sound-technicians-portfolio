import React, {useState, createContext, useRef} from 'react';
import Controls from './Controls';
import './AudioPlayer.css';

type TrackState = {
    trackDuration : number | null,
    playbackPosition : number | null
};

type AudioPlayerProps = {
    audiopath: string
};

type ContextProps = {
    fileName: string,
    trackState: TrackState,
    setTrackState: React.Dispatch<React.SetStateAction<TrackState>> | null,
    progress: number,
    setProgress: React.Dispatch<React.SetStateAction<number>> | null,
    audioRef: React.RefObject<HTMLAudioElement> | null,
    progressRef: React.RefObject<HTMLInputElement> | null
}

export const audioContext = createContext<ContextProps>({fileName: 'Audio', trackState: {trackDuration: null, playbackPosition: null}, setTrackState: null, progress: 0, setProgress: null, audioRef: null, progressRef: null});

const AudioPlayer = ({audiopath}: AudioPlayerProps) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [trackState, setTrackState] = useState<TrackState>({trackDuration: null, playbackPosition: null});
    const [progress, setProgress] = useState(0);
    const pathArray = audiopath.split(/[/ .]/);
    const fileName = pathArray[pathArray.length-2];

    const audioRef = useRef<HTMLAudioElement>(null);
    const progressRef = useRef<HTMLInputElement>(null);
    
    function onLoadedMetadata () {
        if(audioRef.current !== null) {
            setTrackState({trackDuration: audioRef.current.duration, playbackPosition: 0});
        }
        
    }

    function togglePlayPause() {
        setIsPlaying(prev => !prev);
    }
    
    function toggleStop() {
        setIsPlaying(false);
        if(audioRef && audioRef.current !== null) audioRef.current.currentTime = 0;
        setProgress(0);
    }
    
    return (
        <audioContext.Provider value={{fileName, trackState, setTrackState, progress, setProgress, audioRef, progressRef}}>
            <div className='audio-player'>
                <audio preload='metadata' src={audiopath} ref={audioRef} onLoadedMetadata={onLoadedMetadata} onTimeUpdate={(e) => {
                    setTrackState({...trackState, playbackPosition: e.currentTarget.currentTime});
                    setProgress((e.currentTarget.currentTime / Number(trackState.trackDuration)) * 100);
                }
                } onEnded ={() => setIsPlaying(false)}></audio>
                <Controls isPlaying={isPlaying} onPlayPauseClick={togglePlayPause} onStopClick={toggleStop} />
            </div>
        </audioContext.Provider>
    );
};

export default AudioPlayer;