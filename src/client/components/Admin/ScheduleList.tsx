import React, { useContext, useState, useEffect } from 'react';
import ScheduleForm from './ScheduleForm';
import { authContext } from '../../App';
import { Navigate } from 'react-router-dom';
import requestServices from '../../requestServices';

const ScheduleList = () => {
    const auth = useContext(authContext).auth.auth;
    const [schedule, setSchedule] = useState<Array<IEvent>>([]);
    const [categories, setCategories] = useState<Array<{ value: string; label: string; }>>();
    const [equipment, setEquipment] = useState<Array<IEquipment>>();
    const [updated, setUpdated] = useState(true);

    useEffect(() => {
        if(updated)
        {
            requestServices.getSchedule()
                .catch(e => {
                    console.log(e);
                    setUpdated(true);
                })
                .then(schedule => {
                    setSchedule(schedule);
                
                    requestServices.fillScheduleForm()
                        .then(response => {
                            setCategories(response.categories.map(item => {return {value: item, label: item};}));
                            setEquipment(response.equipment);
                            setUpdated(false);
                        
                        })
                        .catch(e => {
                            console.log(e);
                            setUpdated(true);
                        });
                });
        }
    }, [updated]);

    return(
        <div className="container">
            {!auth && (<Navigate to='/' replace={true} />)}
            {categories && equipment && schedule.map(item => <ScheduleForm key={item._id} booking={item} categories={categories} equipment={equipment} setUpdated={setUpdated}/>)}
        </div>
    );
};

export default ScheduleList;