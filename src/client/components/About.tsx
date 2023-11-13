import React from 'react';
import './About.css';
import AudioPlayer from './AudioPlayer/AudioPlayer';
import testAudio from '../../files/work-audio/funny_sound.mp3';

const About = () => {
    
    return(
        <div className="container">

            <h1>About</h1>

            <div className='about-text'>
                <p>
                    Irure ex irure cillum velit nisi nulla irure Lorem Lorem magna velit. Nulla laborum et consequat quis ipsum sint laboris veniam voluptate adipisicing minim consequat. Ea duis excepteur in Lorem consequat id nisi. Magna id quis sunt laboris mollit mollit eu Lorem velit do non. Est adipisicing consectetur reprehenderit voluptate Lorem et consequat quis laborum ullamco elit id. Aliqua duis est ad incididunt. Ut dolor cillum aliqua labore.
                </p>
                <p>
                    Dolore ut et est sunt ipsum duis dolore nostrud aute. Pariatur laborum ex laborum dolore esse incididunt pariatur laboris Lorem irure dolore ullamco. Commodo occaecat duis id ea nostrud aute in. Ut aliquip ad sit adipisicing duis esse ex sunt culpa ad cillum reprehenderit anim. Irure veniam cillum aliqua non sit voluptate duis id in non proident consectetur laborum. Sint labore consectetur velit ad irure occaecat aliqua non.
                </p>
            </div>

            <h1>Work examples</h1>
            <AudioPlayer audiopath={testAudio}/>
        </div>
    );
};

export default About;