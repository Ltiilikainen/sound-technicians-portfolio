import React, {useState, useEffect, useRef, useContext} from 'react';
import requestServices from '../../requestServices';
import AdminButton from './AdminButton';
import Select from 'react-select';
import { authContext } from '../../App';

type EquipmentFormParams = {
    id?: string | undefined,
    setUpdated: React.Dispatch<React.SetStateAction<boolean>>,
    setEditMode?: React.Dispatch<React.SetStateAction<boolean>> | undefined
    setShowNewForm?: React.Dispatch<React.SetStateAction<boolean>> | undefined
};

const EquipmentForm = ({id, setUpdated, setEditMode, setShowNewForm}: EquipmentFormParams) => {
    const token = useContext(authContext).jwt;
    const [error, setError] = useState('');
    const [form, setForm] = useState(useRef<HTMLFormElement | null>(null));

    const [options, setOptions] = useState<Array<{value: string, label: string}>>([]);

    //form values
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [specs, setSpecs] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [quantity, setQuantity] = useState('1');

    useEffect(() => {
        setForm(form);
        requestServices.getEquipmentType()
            .then(result => {
                setOptions((result as IEquipmentType[]).map(type => {
                    return {value: type.type_name, label: type.type_name};
                })
                );
                if(id) {
                    requestServices.getEquipment(id)
                        .then((response: IEquipment[]) => {
                            setName(response[0].name);
                            setType((response[0].type as IEquipmentType).type_name);
                            setSpecs(response[0].specs);
        
                        })
                        .catch(e => {
                            console.log(e.message);
                            setError('Failed to load equipment information.');});
                }
            })
            .then(() => {});


    }, []);

    function handleSubmit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        const isFormValid = form.current?.checkValidity();
        if(!isFormValid) form.current && form.current.reportValidity();
        else {
            e.preventDefault();
            const formData = new FormData();
            image && formData.append('img', image);

            if(id) {
                if(image) {
                    requestServices.uploadImage(formData, token)
                        .then((response) => {
                            requestServices.updateEquipment(id, token, {name, type, specs, quantity, image: response.data.path})
                                .then(() => setUpdated(true))
                                .catch((e) => {
                                    console.log(e);
                                    setError('Something went wrong!');
                                })
                                .finally(() => {
                                    setImage(null);
                                    form.current && form.current.reset();
                                    setEditMode && setEditMode(false);
                                });
                        })
                        .catch((e) => {
                            console.log(e);
                            setError('Something went wrong!');
                        });
                } else {
                    requestServices.updateEquipment(id, token, {name, type, specs, quantity})
                        .then(() => setUpdated(true))
                        .catch((e) => {
                            console.log(e);
                            setError('Something went wrong!');
                        })
                        .finally(() => {
                            setImage(null);
                            form.current && form.current.reset();
                            setEditMode && setEditMode(false);
                        });
                }
            } else {
                if(image) {
                    requestServices.uploadImage(formData, token)
                        .then((response) => {
                            requestServices.addEquipment(token, {name, type, specs, quantity, image: response.data})
                                .then(() => setUpdated(true))
                                .catch((e) => {
                                    console.log(e);
                                    setError('Something went wrong!');
                                })
                                .finally(() => {
                                    setImage(null);
                                    form.current && form.current.reset();
                                    setShowNewForm && setShowNewForm(false);
                                });
                        })
                        .catch((e) => {
                            console.log(e);
                            setError('Something went wrong!');
                        });
                } else {
                    requestServices.addEquipment(token, {name, type, specs, quantity})
                        .then(() => setUpdated(true))
                        .catch((e) => {
                            console.log(e);
                            setError('Something went wrong!');
                        })
                        .finally(() => {
                            setImage(null);
                            form.current && form.current.reset();
                            setShowNewForm && setShowNewForm(false);
                        });
                }
            }

            
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
                        <Select 
                            options={options}
                            onChange={selectedOption => selectedOption && setType(selectedOption?.value)}
                        />
                    </div>
                </div>

                <div className='row justify-content-center'>
                    <div className='col col-4'>
                        <label htmlFor='specs'>Specs</label>
                    </div>
                    <div className='col col-6'>
                        <input id='specs' value={specs} onChange={e => setSpecs(e.target.value)} className='form-control' required/>
                    </div>
                </div>

                <div className='row justify-content-center'>
                    <div className='col col-4'>
                        <label htmlFor='eq-img'>Image</label>
                    </div>
                    <div className='col col-6'>
                        <input 
                            id='eq-img'
                            type='file' 
                            name='img'
                            accept='.jpg, .jpeg, .png, .gif, .svg' 
                            onChange={e => e.target.files && setImage(e.target.files[0])}
                            className='form-control'/>
                    </div>
                </div>

                {setShowNewForm && <div className='row justify-content-center'>
                    <div className='col col-4'>
                        <label htmlFor='quantity'>Quantity</label>
                    </div>
                    <div className='col col-6'>
                        <input id='quantity' type='number' value={quantity} onChange={e => setQuantity(e.target.value)} min={1} className='form-control' required/>
                    </div>
                </div>}
            

                <div className="row">
                    <div className="col col-sm-6">
                        <AdminButton buttonText='Save' buttonClass='btn-secondary' clickHandle={handleSubmit}/>
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