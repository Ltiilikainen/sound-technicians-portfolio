import React, { useEffect, useRef, useState } from 'react';
import requestServices from '../requestServices';
import EquipmentTumb from './EquipmentThumb';

const EquipmentList = () => {
    const [equipment, setEquipment] = useState(Array<IEquipment>);
    const [filteredEquipment, setFilteredEquipment] = useState(Array<IEquipment>);
    const searchBarRef = useRef<HTMLInputElement>(null);
    const typeArray = ['microphone', 'PA'];

    useEffect(() => {
        requestServices.getAllEquipment()
            .then(result => {
                setEquipment(result);
                setFilteredEquipment(result);
            });
    }, []);

    function filterEquipment () {
        const newEquipment = equipment.filter(item => 
            item.name.toLocaleLowerCase()
                .includes(searchBarRef.current ? searchBarRef.current.value : '') 
            && 
            typeArray.indexOf((item.type as IEquipmentType).type_name) > -1);
        return newEquipment;
    }

    function handleChange(checked: boolean, value: string) {
        if(checked){
            if(typeArray.indexOf(value) < 0) typeArray.push(value);
        } else {
            const index = typeArray.indexOf(value);
            typeArray.splice(index, 1);
        }
        setFilteredEquipment(filterEquipment());
    }

    return (
        <div className="container">
            <h1>Equipment List</h1>
            <div className='my-2'>
                <input id='search' placeholder='search' ref={searchBarRef}></input>
                <button className='btn btn-sm btn-light mx-2' onClick={() => setFilteredEquipment(filterEquipment())}>Search</button> 
                <button className='btn btn-sm btn-light' onClick={() => {if(searchBarRef.current) searchBarRef.current.value = '';
                    setFilteredEquipment(() => 
                        filterEquipment());}}>Reset</button>
            </div>
            <div className='row'>
                <div className='col col-12 col-md-4'>
                    <div className='d-flex flex-sm-row flex-md-column text-start'>
                        <div className='form-check form-check-inline'>
                            <input className='form-check-inline' type='checkbox' defaultChecked={true} id='microphone' onChange={e => handleChange(e.target.checked, 'microphone')}></input><label htmlFor='microphone'>Microphone</label>
                        </div>
                        <div className='form-check form-check-inline'>
                            <input className='form-check-inline' defaultChecked={true} type='checkbox' id='PA' onChange={e => handleChange(e.target.checked, 'PA')}></input><label htmlFor='PA'>PA</label>
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