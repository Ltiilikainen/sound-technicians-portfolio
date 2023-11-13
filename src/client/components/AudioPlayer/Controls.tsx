import React, { useCallback, useContext, useEffect, useRef } from 'react';
import ProgressBar from './ProgressBar';
import playIcon from '../../../assets/play_button.svg';
import pauseIcon from '../../../assets/pause_button.svg';
import stopIcon from '../../../assets/stop_button.svg';
import { audioContext } from './AudioPlayer';

type ControlsProps = {
    isPlaying: boolean,
    onPlayPauseClick: () => void,
    onStopClick: () => void,
};

const Controls = ({isPlaying, onPlayPauseClick, onStopClick}: ControlsProps) => {
    const audioRef = useContext(audioContext).audioRef;
    const setProgress = useContext(audioContext).setProgress;
    const progressRef = useContext(audioContext).progressRef;
    const playAnimationRef = useRef<number>(0);

    const repeat = useCallback(() => {
        const currentTime = audioRef?.current?.currentTime || 0;
        const duration = audioRef?.current?.duration || 0;
        setProgress && setProgress(currentTime);
        if(progressRef?.current) {
            progressRef.current.value = (currentTime / duration * 100).toString();
            progressRef.current.style.setProperty(
                '--range-progress',
                `${Number(progressRef.current.value)}%`
            );
        }
        playAnimationRef.current = requestAnimationFrame(repeat);
    }, [audioRef, progressRef, setProgress]);

    useEffect(() => {   
        if(isPlaying) {
            audioRef?.current && audioRef.current.play();
        } else {
            audioRef?.current && audioRef.current.pause();
        }
        playAnimationRef.current = requestAnimationFrame(repeat);
    }, [isPlaying, repeat]);

    return(
        <div className='row row-cols-2'>
            <div className='col col-md-3 mt-2'>
                <ImageButton src={isPlaying ? pauseIcon : playIcon} onClick={() => onPlayPauseClick()}/>
                <ImageButton src={stopIcon} onClick={() => onStopClick()}/>
            </div>
            <div className='col'>
                <p>Audioplayer</p>
                <ProgressBar />
            </div>
        </div>
    );
};

type ImageButtonProps = {
    src: string,
    onClick: () => void,
    className?: string
};

const ImageButton = ({src, onClick, className}: ImageButtonProps) => {
    const buttonSize = 55;
    return(
        <button className='btn control-button' onClick={onClick}>
            <img src={src}
                width={buttonSize}
                height={buttonSize}
                className={` ${className ?? ''}`} />
        </button>
    );
};

export default Controls;