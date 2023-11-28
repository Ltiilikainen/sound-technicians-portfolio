import React, { useContext, useEffect, useRef, useState } from 'react';
import requestServices from '../requestServices';
import EquipmentTumb from './EquipmentThumb';
import AdminButton from './Admin/AdminButton';
import './EquipmentList.css';
import EquipmentForm from './Admin/EquipmentForm';
import { authContext } from '../App';

const EquipmentList = () => {
    const auth = useContext(authContext).auth;
    const [types, setTypes] = useState(Array<string>);
    const [updated, setUpdated] = useState(false);
    const [equipment, setEquipment] = useState(Array<IEquipment>);
    const [filteredEquipment, setFilteredEquipment] = useState(Array<IEquipment>);
    let typeArray: string[] = [];
    const searchBarRef = useRef<HTMLInputElement>(null);
    const [showNewForm, setShowNewForm] = useState(false);
    
    useEffect(() => {
        requestServices.getEquipmentType()
            .then(result => {
                setTypes((result as IEquipmentType[]).map(type => type.type_name));
                typeArray.concat(types);
            }).then(() => {
                requestServices.getEquipment()
                    .catch(e => console.log(e.message))
                    .then(result => {
                        setEquipment(result);
                        setFilteredEquipment(result);
                    });
            });

    }, []);
    
    useEffect(() => {
        if(updated) {
            requestServices.getEquipment()
                .catch(e => console.log(e.message))
                .then(result => {
                    setEquipment(result);
                    setFilteredEquipment(result);
                    setUpdated(false);
                });
        }
    }, [updated]);



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
            { auth ?
                <div className='row justify-content-center'>
                    {
                        showNewForm ? 
                            <EquipmentForm setUpdated={setUpdated} setShowNewForm={setShowNewForm}/> 
                            : <div className='col col-2'><AdminButton buttonText='Add new' buttonClass='btn-light' clickHandle={() => setShowNewForm(true)} /></div>}
                </div> 
                : null
            }
            <div className='row'>
                <div className='col col-12 col-md-3'>
                    <div className='d-flex flex-sm-row flex-md-column text-start type-toggle mb-2'>
                        <div className='form-check form-check-inline'>
                            <input className='form-check-inline' type='checkbox' defaultChecked={true} id='selectAll' onChange={e => {
                                const checks = document.getElementsByName('type');
                                checks.forEach(check => (check as HTMLInputElement).checked = e.target.checked);
                                if (e.target.checked) {
                                    typeArray = types;
                                } else {
                                    typeArray = [];
                                }
                                setFilteredEquipment(filterEquipment());
                            }}></input><label htmlFor='selectAll'>Select all</label>
                        </div>
                        {types.map( type => <div key={type} className='form-check form-check-inline'>
                            <input 
                                className='form-check-inline' 
                                type='checkbox' 
                                name='type' 
                                defaultChecked={true} 
                                id={type} 
                                onChange={e => handleChange(e.target.checked, type)}/>
                            <label htmlFor={type}>{type}</label>
                        </div>)}
                    </div>
                </div>
                <div className='col col-12 col-md-8'>

                    {   filteredEquipment && filteredEquipment.length !== 0 ?
                        filteredEquipment.map(item => 
                            <EquipmentTumb 
                                key={item._id} 
                                id={String(item._id)} 
                                name={item.name} 
                                img={String(item.image)} 
                                specs={item.specs} 
                                individuals={item.individuals} 
                            />)
                        : null
                    }
                </div>
            </div>

        </div>
    );
};

export default EquipmentList;