import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import requestServices from '../requestServices';
import ReferenceThumb from './ReferenceThumb';
import AudioPlayer from './AudioPlayer/AudioPlayer';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

type HomeRequest = {
    refs: IReference[],
    workedWith: string,
    workExamples: IWorkExample[],
    bookings: IEvent[]
};

const HomePage = () => {
    const [workedWithImg, setWorkedWithImg] = useState('');
    const [refArray, setRefArray] = useState(Array<IReference>);
    const [workExamples, setWorkeExamples] = useState(Array<IWorkExample>);
    const [schedule, setSchedule] = useState(Array<ICalendarEvents>);

    useEffect(() => {
        requestServices.getHomePage()
            .then((data: HomeRequest) => {
                console.log(data);
                setWorkedWithImg(data.workedWith);
                setRefArray(data.refs.map(ref => ref = {_id: ref._id, name: ref.name, image: ((ref.image as unknown) as IFile[])[0], affiliation: ref.affiliation, content: ref.content}));
                setWorkeExamples(data.workExamples.map(example => example = {_id: example._id, file: ((example.file as unknown) as IFile[])[0], occasions: example.occasions}));
                setSchedule(data.bookings.map(booking => parseEvent(booking)));
            });
    }, []);

    function parseEvent (event:IEvent) {
        if(event.display_description)
        {
            return {title: event.description, start: event.time_id.start_date, end: event.time_id.end_date, allDay: true, display: 'background'};
        } else {
            return {start: event.time_id.start_date, end: event.time_id.end_date, allDay: true, display: 'background'};
        }
    }

    return (
        <>
            <div className="hero-img">
                <span className="hero-text">Firstname &#34;Nickname&#34; Lastname</span>
            </div>
            <div className="container">
                <h1>Home Page</h1>
                <div className='row text-start justify-content-center'>
                    <h2>I&apos;ve worked with</h2>
                    {workedWithImg === '' ? null : <img src={workedWithImg} className='w-75' />}
                </div>
                <div className='row'>
                    {refArray.length > 0 ? refArray.map(ref => <div key={ref._id} className='col-12 col-md-4'><ReferenceThumb reference={ref}/></div>) : 'loading...'}
                </div>
                <div className='row'>
                    <div className='d-flex col-12 col-md-6 justify-content-center'>
                        <div className='mx-auto'>
                            <h2>Examples of my work</h2>
                            {workExamples.length >= 1 ? workExamples.map(example => <AudioPlayer key={example._id} audiopath={example.file.path} />) : 'loading...'}
                        </div>
                    </div>
                    <div className='col-12 col-md-6 mb-3'>
                        <h2>This month&apos;s schedule</h2>
                        <FullCalendar
                            plugins={[dayGridPlugin]} 
                            initialView='dayGridMonth'
                            weekends={true}
                            displayEventTime={false}
                            contentHeight={'auto'}
                            events={schedule}
                            headerToolbar={{
                                start:'',
                                center:'',
                                end:''
                            }}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='col col-12 d-flex flex-column flex-md-row justify-content-center mb-3'>
                        <h2 className='me-4'>Want to work together?</h2>
                        <Link to='/contact-me'><button className='btn btn-light btn-lg'>Contact me</button></Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HomePage;