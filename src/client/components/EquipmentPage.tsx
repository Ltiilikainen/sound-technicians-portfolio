import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import requestServices from '../requestServices';
import EquipmentInfo from './EquipmentInfo';
import EquipmentChildBookings from './EquipmentChildBookings';

const EquipmentPage = () => {
    const {id} = useParams();
    const [equipmentInfo, setEquipmentInfo] = useState<IEquipment | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [dateRef, setDateRef] = useState(useRef<HTMLInputElement>(null));
    const [searchDate, setSearchDate] = useState(new Date(Date.now()).toISOString());

    useEffect(() => {
        if(id) {
            requestServices.getOneEquipment(id)
                .then(result => {
                    if(result === '') setError('Equipment not found');
                    else setEquipmentInfo(result[0]);
                    console.log(result);
                }
                );
        } else {
            setError('Equipment not found');
        }
        setDateRef(dateRef);
    }, []);

    return (
        <div className="container">
            <Link to={'/equipment'}> <p>← Back to equipment list</p></Link>
            {error ? <div>{error}</div> : null}
            <EquipmentInfo equipment={equipmentInfo} />
            <h4>Availability</h4>

            <input id="datesearch" type="date" ref={dateRef}></input> <button className="btn btn-light ms-1" onClick={() => setSearchDate(dateRef.current? dateRef.current.value : new Date(Date.now()).toISOString())}>Search</button>

            <div className='row row-cols-md-2'>
                {
                    equipmentInfo?.individuals.map((item, index) => <div key={(item as IEquipmentChild)._id} className='col col-md-6'> <p>{equipmentInfo.name} #{index+1}</p> <EquipmentChildBookings bookings={(item as IEquipmentChild).bookings} searchDate={searchDate} /> </div>)
                }
            </div>
        </div>);
};

export default EquipmentPage;