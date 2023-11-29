import React, { useState, useEffect } from 'react';
import AdminButton from './AdminButton';
import Select from 'react-select';

type ScheduleFormProps = {
    booking?: IEvent | undefined,
    categories:{ value: string; label: string; }[],
    equipment: IEquipment[],
    setShowNewForm?: React.Dispatch<React.SetStateAction<boolean>> | undefined,
    setUpdated: React.Dispatch<React.SetStateAction<boolean>>
}

const ScheduleForm = ({booking, categories, equipment, setShowNewForm, setUpdated}: ScheduleFormProps) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [description, setDescription] = useState('');
    const [showDescription, setShowDescription] = useState(true);

    useEffect(() => {
        if(booking) {
            setStartDate(booking.time_id.start_date);
            setEndDate(booking.time_id.end_date);
            setDescription(booking.description);
            setShowDescription(booking.display_description);
        }
    }, []);

    return(
        <form className='card px-2 py-1'>
            <div className="row">
                <div className="col col-10">
                    <div className="row">
                        <div className="col">
                            <div className="row row-cols-2">
                                <div className="col-auto"><label htmlFor="start-date" className="col-form-label">Start date</label></div>
                                <div className="col-auto"><input id="start-date" type="date" className="form-control" value={startDate.split('T')[0]} onChange={e => setStartDate(e.target.value)}></input></div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="row row-cols-2">
                                <div className="col-auto"><label htmlFor="end-date" className="col-form-label">End Date</label></div>
                                <div className="col-auto"><input id="end-date" type="date" className="form-control" value={endDate.split('T')[0]} onChange={e => setEndDate(e.target.value)}></input></div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-auto"><label htmlFor="description" className="col-form-label">Description</label></div>
                        <div className="col"><input id="description" className="form-control" value={description} onChange={e => setDescription(e.target.value)}></input></div>
                    </div>
                    <div className="form-check">
                        <input type="checkbox" id="display-check" className="form-check-inline" checked={showDescription} onChange={e => setShowDescription(e.target.checked)}></input>
                        <label htmlFor="display-check" className="form-check-label">Display Description</label>
                    </div>
                    <div className="row">
                        <div className="col col-auto"><p>Category</p></div>
                        <div className="col">
                            <Select 
                                options={categories}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col col-auto"><p>Equipment</p></div>
                        <div className="col">
                            <label>Equipment</label>
                            <div className="">
                                {equipment && equipment.map(instance => 
                                    <span 
                                        className='dropdown-item' 
                                        key={instance._id}>
                                        {instance.name} 
                                        <input type="number"
                                            max={instance.individuals.length}/></span>)}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <AdminButton buttonText="Save" buttonClass="btn-success" clickHandle={() => setUpdated(true)} />
                    {setShowNewForm ? 
                        <AdminButton buttonText="Cancel" buttonClass="btn-secondary" clickHandle={() => setShowNewForm(false)} /> 
                        : <AdminButton buttonText="Delete" buttonClass="btn-danger" clickHandle={() => console.log(booking?._id) } />}
                </div>
            </div>
        </form>

    );
};

export default ScheduleForm;