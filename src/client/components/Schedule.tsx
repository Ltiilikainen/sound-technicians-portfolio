import React, {useEffect, useState, useRef} from 'react';
import requestServices from '../requestServices';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import multiMonthPlugin from '@fullcalendar/multimonth';

const Schedule = () => {
    const [events, setEvents] = useState<Array<ICalendarEvents>>([]);
    const [scheduleRef, setScheduleRef] = useState(useRef<FullCalendar | null>(null));
    const [searchDate, setSearchDate] = useState('');

    useEffect(() => {
        requestServices.getSchedule()
            .then(schedule => setEvents(schedule.map((item:IEvent) => parseEvent(item)))
            );
    }, []);

    function parseEvent (event:IEvent) {
        if(event.display_description)
        {
            return {title: event.description, start: event.time_id.start_date, end: Date.parse(event.time_id.end_date), allDay: true, display: 'background'};
        } else {
            return {start: event.time_id.start_date, end: event.time_id.end_date, allDay: true, display: 'background'};
        }
    }

    return (
        <div className="container">
            <h1>Schedule</h1>

            <div className='row justify-content-center'>
                <div className='col col-auto text-end'>
                    <input id="datesearch" type="date" className='form-control' onChange={e => setSearchDate(e.target.value)}></input> 
                </div>
                <div className='col col-auto text-start'>
                    <button className="btn btn-light ms-1" onClick={() => scheduleRef.current?.getApi().gotoDate(Date.parse(searchDate))}>Search</button>
                </div>
            </div>

            <div className='row justify-content-center my-3'>
                <div className='col col-12 col-md-9 col-lg-6'>
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
            </div>

            <div className='mb-4'>
                <FullCalendar
                    plugins={[multiMonthPlugin]}
                    initialView='multiMonthSixMonth'
                    views={{'multiMonthSixMonth': {type: 'multiMonth', duration: {months: 6}}}}
                    events={events}
                    displayEventTime={false}
                    contentHeight={'auto'}
                />
            </div>
        </div>
    );
};

export default Schedule;