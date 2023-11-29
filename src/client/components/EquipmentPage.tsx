import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import requestServices from '../requestServices';
import EquipmentInfo from './EquipmentInfo';
import EquipmentChildBookings from './EquipmentChildBookings';
import { authContext } from '../App';
import AdminButton from './Admin/AdminButton';
import EquipmentForm from './Admin/EquipmentForm';
import EquipmentBookingForm from './Admin/EquipmentBookingForm';

const EquipmentPage = () => {
    const auth = useContext(authContext).auth.auth;
    const [editMode, setEditMode] = useState(false);
    const [updated, setUpdated] = useState(true);
    const {id} = useParams();
    const [equipmentInfo, setEquipmentInfo] = useState<IEquipment | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [dateRef, setDateRef] = useState(useRef<HTMLInputElement>(null));
    const [searchDate, setSearchDate] = useState(new Date(Date.now()).toISOString());
    const [showBookingForm, setShowBookingForm] = useState(false);

    useEffect(() => {
        if(updated) {
            requestServices.getEquipment(id)
                .catch(e => {
                    console.log(e);
                    setError('Equipment not found');
                })
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

    function handleDelete () {

    }

    function handleChildAdd () {

    }
    
    function handleChildDelete () {

    }

    return (
        <div className="container">
            <div className='row text-start'>
                <Link to={'/equipment'}> <p>← Back to equipment list</p></Link>
            </div>
            {error ? <div>{error}</div> : null}
            {auth ? <div className='row justify-content-end'>
                <div className='col col-1'><AdminButton buttonText='Edit' buttonClass='btn-secondary' clickHandle={() => setEditMode(true)}/></div>
                <div className='col col-1'><AdminButton buttonText='Delete' buttonClass='btn-danger' clickHandle={handleDelete}/></div>
            </div>
                :null
            }

            {editMode ?
                <EquipmentForm id={id} setEditMode={setEditMode} setUpdated={setUpdated}/>
                :
                <>
                    <EquipmentInfo equipment={equipmentInfo} />
                </>
            }
            <h4>Availability</h4>
            {auth ? <div className='row justify-content-center'> 
                <div className='col col-4'>
                    <AdminButton buttonText='Add New Instance' buttonClass='btn-secondary' clickHandle={handleChildAdd} /> 
                </div> 
            </div> 
                : null}
            <div className='row justify-content-center'>
                <div className='col col-auto text-end'>
                    <input id="datesearch" type="date" className='form-control' ref={dateRef}></input> 
                </div>
                <div className='col col-auto text-start'>
                    <button className="btn btn-light ms-1" onClick={() => setSearchDate(dateRef.current? dateRef.current.value : new Date(Date.now()).toISOString())}>Search</button>
                </div>
            </div>

            <div className='row row-cols-md-2'>
                {
                    equipmentInfo && (equipmentInfo.individuals[0] as IEquipmentChild)._id && 
                   equipmentInfo.individuals.map((item, index) => 
                       <div key={(item as IEquipmentChild)._id} className='col col-md-6'> 
                           <p>{equipmentInfo.name} #{index+1}</p> 
                           {auth ?
                               <>
                                   <div>
                                       {showBookingForm ? <EquipmentBookingForm id={(item as IEquipmentChild)._id} setShowBookingForm={setShowBookingForm}/> : 
                                           <>
                                               <AdminButton buttonText='Bookings' buttonClass='btn-secondary' clickHandle={() => setShowBookingForm(true)} />
                                               <AdminButton buttonText='Delete Instance' buttonClass='btn-danger' clickHandle={handleChildDelete} /> 
                                           </>
                                       }
                                   </div>
                               </>    
                               : null}
                            
                           <EquipmentChildBookings bookings={(item as IEquipmentChild).bookings} searchDate={searchDate} /> 
                       </div>
                   )}
            </div>
        </div>);
};

export default EquipmentPage;