import React, { useEffect, useState } from 'react';
import AdminButton from './AdminButton';
import DateInput from '../Inputs/DateInput';
import Select from 'react-select';

type EquipmentBookingFormProps = {
    id: string | undefined,
    setShowBookingForm: React.Dispatch<React.SetStateAction<boolean>>
}

const EquipmentBookingForm = ({id, setShowBookingForm}: EquipmentBookingFormProps) => {
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');

    useEffect(() => {
        console.log(id);
    }, []);

    function handleArray() {
        
    }

    function handleSubmit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
    }

    function handleCancel(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
        setShowBookingForm(false);
    }

    const options = [
        {value: '22-1-23 - 24-1-23', label: '22-1-23 - 24-1-23'},
        {value: '2-2-23 - 6-2-23', label: '2-2-23 - 6-2-23'}
    ];

    return (
        <div className='row justify-content-center'>
            <div className='col col-md-7'>
                <form>
                    <div className='row'>
                        <div className='col'>
                            <p>Add existing</p>
                            <Select 
                                isMulti={true}
                                options={options}
                                onChange={handleArray}
                            />
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col'>
                            <p>Create new</p>
                            <div className="row">
                                <div className="col">
                                    <DateInput 
                                        inputId='start-date'
                                        label='Start date'
                                        value={start}
                                        onChange={e => setStart(e.target.value)}
                                    />
                                </div>
                                <div className="col">
                                    <DateInput 
                                        inputId='end-date'
                                        label='End date'
                                        value={end}
                                        onChange={e => setEnd(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col'>
                            <AdminButton buttonText='Save' buttonClass='btn-secondary' clickHandle={handleSubmit}/>
                            <AdminButton buttonText='Cancel' buttonClass='btn-danger' clickHandle={handleCancel} />  
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default EquipmentBookingForm;