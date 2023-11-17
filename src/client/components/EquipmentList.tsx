import React, { useEffect, useRef, useState } from 'react';
import requestServices from '../requestServices';
import EquipmentTumb from './EquipmentThumb';

const EquipmentList = () => {
    const [equipment, setEquipment] = useState(Array<IEquipment>);
    const [filteredEquipment, setFilteredEquipment] = useState(Array<IEquipment>);
    const searchbarRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        requestServices.getAllEquipment()
            .then(result => {
                setEquipment(result);
                setFilteredEquipment(result);
            });
    }, []);

    function handleChange(checked: boolean, value: string) {
        checked ?
            setFilteredEquipment(equipment.filter(item => (item.type as IEquipmentType).type_name === value))
            : setFilteredEquipment(equipment);
    }

    return (
        <div className="container">
            <h1>Equipment List</h1>
            <div className='my-2'>
                <input id='search' placeholder='search' ref={searchbarRef}></input><button className='btn btn-sm btn-light mx-2' onClick={() => setFilteredEquipment(equipment.filter(item => item.name.toLocaleLowerCase().includes(searchbarRef.current ? searchbarRef.current.value.toLocaleLowerCase() : '')))}>Search</button> <button className='btn btn-sm btn-light' onClick={() => setFilteredEquipment(equipment)}>Reset</button>
            </div>
            <div className='row'>
                <div className='col col-12 col-md-4'>
                    <div className='d-flex flex-sm-row flex-md-column text-start'>
                        <div className='form-check form-check-inline'>
                            <input className='form-check-inline' type='checkbox' id='microphone' onChange={e => handleChange(e.target.checked, 'microphone')}></input><label htmlFor='microphone'>Microphone</label>
                        </div>
                        <div className='form-check form-check-inline'>
                            <input className='form-check-inline' type='checkbox' id='PA' onChange={e => handleChange(e.target.checked, 'PA')}></input><label htmlFor='PA'>PA</label>
                        </div>
                    </div>
                </div>
                <div className='col col-12 col-md-8'>

                    {
                        filteredEquipment.map(item => <EquipmentTumb key={item._id} id={item._id} name={item.name} specs={item.specs} individuals={item.individuals} />)
                    }
                </div>
            </div>

        </div>
    );
};

export default EquipmentList;