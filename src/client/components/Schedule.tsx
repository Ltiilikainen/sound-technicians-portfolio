import React, {useEffect, useState, useRef} from 'react';
import './Schedule.css';
import requestServices from '../requestServices';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import multiMonthPlugin from '@fullcalendar/multimonth';

interface ICalendarEvents {
    title?: string,
    start: string,
    end: string
}

const Schedule = () => {
    const [events, setEvents] = useState<Array<ICalendarEvents>>([]);
    const [scheduleRef, setScheduleRef] = useState(useRef<FullCalendar | null>(null));
    const [searchDate, setSearchDate] = useState('');

    useEffect(() => {
        requestServices.getSchedule()
            .then(schedule => setEvents(schedule.map((item:IBooking) => parseEvent(item)))
            );
    }, []);

    function parseEvent (event:IBooking) {
        if(event.display_description)
        {
            return {title: event.description, start: event.start_date, end: Date.parse(event.end_date), allDay: true, display: 'background'};
        } else {
            return {start: event.start_date, end: event.end_date, allDay: true, display: 'background'};
        }
    }

    return (
        <div className="container">
            <h1>Schedule</h1>

            
            <input id="datesearch" type="date" onChange={e => {
                setSearchDate(e.target.value);
            }}></input> <button className="btn btn-light ms-1" onClick={() => scheduleRef.current?.getApi().gotoDate(Date.parse(searchDate))}>Search</button>

            <div className='my-4'>
                <FullCalendar
                    ref={scheduleRef}
                    viewDidMount={() => setScheduleRef(scheduleRef)}
                    plugins={[dayGridPlugin]}
                    initialView='dayGridMonth'
                    weekends={true}
                    events={events}
                    displayEventTime={false}
                    contentHeight={'auto'}
                />
            </div>

            <div className='mb-4'>
                <FullCalendar
                    plugins={[multiMonthPlugin]}
                    initialView='multiMonthSixMonth'
                    views={{'multiMonthSixMonth': {type: 'multiMonth', duration: {months: 6}}}}
                    events={events}
                    displayEventTime={false}
                />
            </div>
        </div>
    );
};

export default Schedule;