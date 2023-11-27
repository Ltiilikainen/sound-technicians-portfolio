import React, {useState, useEffect, useRef} from 'react';
import requestServices from '../../requestServices';
import AdminButton from './AdminButton';

type EquipmentFormParams = {
    id?: string | undefined,
    setUpdated: React.Dispatch<React.SetStateAction<boolean>>,
    setEditMode?: React.Dispatch<React.SetStateAction<boolean>> | undefined
    setShowNewForm?: React.Dispatch<React.SetStateAction<boolean>> | undefined
};

const EquipmentForm = ({id, setUpdated, setEditMode, setShowNewForm}: EquipmentFormParams) => {
    const [error, setError] = useState('');
    const [form, setForm] = useState(useRef<HTMLFormElement | null>(null));

    //form values
    const [name, setName] = useState('');
    const [type, setType] = useState('');

    useEffect(() => {
        setForm(form);
        if(id) {
            requestServices.getEquipment(id)
                .then((response: IEquipment[]) => {
                    setName(response[0].name);
                    setType((response[0].type as IEquipmentType).type_name);

                })
                .catch(e => {
                    console.log(e.message);
                    setError('Failed to load equipment informaiton.');});
        }
    }, []);

    function handleSubmit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        const isFormValid = form.current?.checkValidity();
        if(!isFormValid) form.current && form.current.reportValidity();
        else {
            e.preventDefault();
            setUpdated(true);
        }
    }

    function handleCancel (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
        setEditMode && setEditMode(false);
        setShowNewForm && setShowNewForm(false);
    }


    return (
        <>
            { error !== '' ?
                <div className='col col-5'>
                    <div className='alert alert-danger' role='alert' id="invalid-alert">
                        <p>{error}</p>
                    </div>
                </div>
                : null
            }
            <form id="equipment-form" ref={form}>
                <div className='row justify-content-center'>
                    <div className='col col-4'>
                        <label htmlFor='name'>Name</label>
                    </div>
                    <div className='col col-6'>
                        <input id='name' className='form-control' value={name} onChange={e => setName(e.target.value)} required/>
                    </div>
                </div>

                <div className='row justify-content-center'>
                    <div className='col col-4'>
                        <label htmlFor='type'>Type</label>
                    </div>
                    <div className='col col-6'>
                        <input id='type' type='select' value={type} onChange={e => setType(e.target.value)} className='form-control' required/>
                    </div>
                </div>

                <div className='row justify-content-center'>
                    <div className='col col-4'>
                        <label htmlFor='specs'>Specs</label>
                    </div>
                    <div className='col col-6'>
                        <input id='specs' className='form-control' required/>
                    </div>
                </div>

                <div className='row justify-content-center'>
                    <div className='col col-4'>
                        <label htmlFor='eq-img'>Image</label>
                    </div>
                    <div className='col col-6'>
                        <input 
                            id='eq-image'
                            type='file' 
                            name='img'
                            accept='.jpg, .jpeg, .png, .gif, .svg' 
                            className='form-control'/>
                    </div>
                </div>

                <div className='row justify-content-center'>
                    <div className='col col-4'>
                        <label htmlFor='quantity'>Quantity</label>
                    </div>
                    <div className='col col-6'>
                        <input id='quantity' type='number' min={1} className='form-control' required/>
                    </div>
                </div>
            

                <div className="row">
                    <div className="col col-sm-6">
                        <AdminButton buttonText='Save' buttonClass='btn-primary' clickHandle={handleSubmit}/>
                    </div>
                    <div className="col col-sm-6">
                        <AdminButton buttonText='Cancel' buttonClass='btn-danger' clickHandle={handleCancel} />
                    </div>    
                </div>
            </form>
        </>
    );
    
};

export default EquipmentForm;