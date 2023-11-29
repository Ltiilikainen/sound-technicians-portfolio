import React, { useState, useEffect } from 'react';
import AdminButton from './AdminButton';
import Select from 'react-select';
import DateInput from '../Inputs/DateInput';
import TextInput from '../Inputs/TextInput';

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
                            <DateInput 
                                inputId='start-date'
                                label='Start date'
                                value={startDate.split('T')[0]}
                                onChange={e => setStartDate(e.target.value)}
                            />
                        </div>
                        <div className="col">
                            <DateInput 
                                inputId='end-date'
                                label='End date'
                                value={endDate.split('T')[0]}
                                onChange={e => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <TextInput 
                            inputId='description'
                            label='Description'
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
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
            </div>
        </form>

    );
};

export default ScheduleForm;