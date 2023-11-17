import React, { useState, useEffect, useRef } from 'react';
import './Schedule.css';
import FullCalendar from '@fullcalendar/react';
import multiMonthPlugin from '@fullcalendar/multimonth';

type EquipmentChildBookingsProps = {
    bookings: Array<IBooking>,
    searchDate:string
};

type EquipmentBooking = {
    start: string,
    end: string,
    allDay: boolean,
    display: string
};

const EquipmentChildBookings = ({bookings, searchDate}: EquipmentChildBookingsProps) => {
    const [events, setEvents] = useState(Array<EquipmentBooking>);
    const [scheduleRef, setScheduleRef] = useState(useRef<FullCalendar | null>(null));

    function parseEvent(booking: IBooking) {
        return {title: 'Unavailable', start: booking.start_date, end: booking.end_date, allDay:true, display: 'background'};
    }
    
    useEffect(() => {
        setEvents(bookings.map(item => parseEvent(item)));
        setScheduleRef(scheduleRef);
    }, []);

    useEffect(() => {if(scheduleRef.current)scheduleRef.current?.getApi().gotoDate(Date.parse(searchDate));}, [searchDate]);

    
    console.log(events);

    return (
        <FullCalendar
            ref={scheduleRef}
            plugins={[multiMonthPlugin]}
            initialView='multiMonthSixMonth'
            views={{'multiMonthSixMonth': {type: 'multiMonth', duration: {months: 6}}}}
            events={events}
            displayEventTime={false}
            headerToolbar={{
                start:'',
                center:'today prev,next',
                end:''
            }}
        />
    );
};

export default EquipmentChildBookings;