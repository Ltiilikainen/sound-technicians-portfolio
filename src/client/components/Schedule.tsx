import React, {useEffect, useState} from 'react';
import './Schedule.css';
import requestServices from '../requestServices';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

interface ICalendarEvents {
    title?: string,
    start: string,
    end: string
}

const Schedule = () => {
    const [events, setEvents] = useState<Array<ICalendarEvents>>([]);

    useEffect(() => {
        requestServices.getSchedule()
            .then(schedule => setEvents(schedule.map((item:IBooking) => parseEvent(item)))
            );
        console.log(events);
    }, []);

    function parseEvent (event:IBooking) {
        if(event.display_description)
        {
            return {title: event.description, start: Date.parse(event.start_date), end: Date.parse(event.end_date)};
        } else {
            return {start: Date.parse(event.start_date), end: Date.parse(event.end_date)};
        }
    }

    return (
        <div className="container">
            <h1>Schedule</h1>

            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView='dayGridMonth'
                weekends={true}
                events={events}
                displayEventTime={false}
            />
        </div>
    );
};

export default Schedule;