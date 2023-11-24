import React, { useState, useEffect, useContext } from 'react';
import './About.css';
import requestServices from '../requestServices';
import WorkExampleForm from './Admin/WorkExampleForm';
import WorkExample from './WorkExample';
import { authContext } from '../App';

const About = () => {
    const auth = useContext(authContext).auth;
    const [audioFiles, setAudioFiles] = useState(Array<IWorkExample>);
    const [updated, setUpdated] = useState(true);
    const [showNewForm, setShowNewForm] = useState(false);

    useEffect(() => {
        if(updated) {
            requestServices.getWorkAudio()
                .then(fileList => {
                    console.log(fileList);
                    setAudioFiles(fileList);
                    setUpdated(false);
                });
        }
    }, [updated]);
    
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

            <div className='rates'>
                <h1>My estimated rates</h1>
                <p>Hourly via billing service<span className='prices'> ~40€/h</span></p>
                <p>Daily via billing service<span className='prices'> ~400€ + VAT/d</span></p>
                <p>Daily by income-tax card<span className='prices'> ~250-350€/d</span></p>
            </div>

            <h1>Work examples</h1>
            { audioFiles.map(file => 
            {
                return (
                    <WorkExample key={file._id} file={file} setUpdated={setUpdated} />
                );}
            )}
            { auth.auth?
                showNewForm ?
                    <WorkExampleForm setUpdated={setUpdated} setShowNewForm={setShowNewForm} />
                    : <button className='btn btn-light mb-4' onClick={() => setShowNewForm(true)}>Add new</button>
                : null
            }
        </div>
    );
};

export default About;