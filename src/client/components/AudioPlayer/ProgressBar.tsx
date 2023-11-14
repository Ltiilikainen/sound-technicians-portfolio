import React, {useContext} from 'react';
import { audioContext } from './AudioPlayer';

const ProgressBar = () => {
    const trackDuration = useContext(audioContext).trackState.trackDuration;
    const playbackPosition = useContext(audioContext).trackState.playbackPosition;
    const value = useContext(audioContext).progress;
    const audioRef = useContext(audioContext).audioRef;
    const progressRef = useContext(audioContext).progressRef;

    function parseTime(time: number) {
        const minutes = Math.round(time / 60);
        const seconds = Math.round(time % 60);

        let minutesString = minutes.toString();
        let secondsString = seconds.toString();

        if(minutes < 10) minutesString = '0' + minutesString;
        if(seconds < 10) secondsString = '0' + secondsString;

        return {minutesString, secondsString};
    }

    function onProgressChange (event: React.ChangeEvent<HTMLInputElement>) {
        console.log(event.target.value);
        if(audioRef && audioRef.current !== null) audioRef.current.currentTime = Number(trackDuration) * (parseFloat(event.target.value) / 100 );
        console.log(audioRef?.current?.currentTime);
    }


    return(
        <div className='mt-3'>
            <div className='row row-cols-1 mb-1'>
                <input 
                    type="range"
                    min="0"
                    max="100"
                    step="0.05"
                    className="slider"
                    value={value}
                    ref={progressRef}
                    onChange={(e) => onProgressChange(e)}/>
            </div>
            <div className='row row-cols-2 mx-1'>
                <div className='col text-start'>
                    <span>{typeof(playbackPosition) === 'number' ? parseTime(playbackPosition).minutesString : '--'} : {typeof(playbackPosition) === 'number' ? parseTime(playbackPosition).secondsString : '--'}</span>
                </div>
                <div className='col text-end'>
                    <span>{trackDuration ? parseTime(trackDuration).minutesString : '--'} : {trackDuration ? parseTime(trackDuration).secondsString : '--'}</span>
                </div>
            </div>
        </div>
    );
};

export default ProgressBar;