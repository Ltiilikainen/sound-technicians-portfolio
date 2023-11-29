import React, { useContext, useEffect, useRef, useState } from 'react';
import requestServices from '../../requestServices';
import { authContext } from '../../App';
import AdminButton from './AdminButton';

type ReferenceFormParams = {
    id?: string | undefined,
    setUpdated: React.Dispatch<React.SetStateAction<boolean>>,
    setEditMode?: React.Dispatch<React.SetStateAction<boolean>> | undefined
    setShowNewForm?: React.Dispatch<React.SetStateAction<boolean>> | undefined
};

const ReferenceForm = ({id, setUpdated, setEditMode, setShowNewForm}: ReferenceFormParams) => {
    const [error, setError] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [refName, setRefName] = useState('');
    const [refAffiliation, setRefAffiliation] = useState('');
    const [refContent, setRefContent] = useState('');
    
    const [form, setForm] = useState(useRef<HTMLFormElement | null>(null));
    const jwt = useContext(authContext).jwt;

    useEffect(() => {
        setForm(form);
        if(id) {
            requestServices.getReferences(id)
                .catch(error => {
                    console.log(error);
                    setError('Could not load data');
                })
                .then(response => {
                    setRefName(response[0].name);
                    setRefAffiliation(response[0].affiliation);
                    setRefContent(response[0].content);
                });
        }
    }, []);

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const isFormValid = form.current?.checkValidity();
        if(!isFormValid) form.current && form.current.reportValidity();
        else {
            e.preventDefault();
            
            const formData = new FormData();
            image && formData.append('img', image);
            
            if(id) {
                console.log(id);
                if(!image) {
                    requestServices.updateReference(id, jwt, refName, refAffiliation, refContent)
                        .then(() => setUpdated(true))
                        .catch(e => {
                            console.log(e);
                        })
                        .finally(() => {
                            setImage(null);
                            form.current && form.current.reset();
                        });
                } else {
                    requestServices.uploadImage(formData, jwt)
                        .then(response => {
                            console.log(response);
                            if(response.status !== 201) {
                                setError(response.data);
                            } else {
                                requestServices.updateReference(id, jwt, refName, refAffiliation, refContent, response.data)
                                    .then(() => setUpdated(true))
                                    .catch(e => {
                                        console.log(e);
                                    })
                                    .finally(() => {
                                        setImage(null);
                                        form.current && form.current.reset();
                                    });
                            }});
                }
                setEditMode && setEditMode(false);
            } else {
                if(!image) {
                    requestServices.writeNewReference({name: refName, affiliation: refAffiliation, content: refContent}, jwt)
                        .then(() => setUpdated(true))
                        .catch(e => {
                            console.log(e);
                        })
                        .finally(() => {
                            setImage(null);
                            form.current && form.current.reset();
                        });
                } else {
                    requestServices.uploadImage(formData, jwt)
                        .then(response => {
                            console.log(response);
                            if(response.status !== 201) {
                                setError(response.data);
                            } else {
                                requestServices.writeNewReference({name: refName, affiliation: refAffiliation, content: refContent}, jwt, response.data)
                                    .then(() => setUpdated(true))
                                    .catch(e => {
                                        console.log(e);
                                    })
                                    .finally(() => {
                                        setImage(null);
                                        setRefName('');
                                        setRefAffiliation('');
                                        setRefContent('');
                                        form.current && form.current.reset();
                                        setShowNewForm && setShowNewForm(false);
                                    });
                            }});
                }

            }

        }
    };

    function handleCancel (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
        setImage(null);
        setError('');
        form.current && form.current.reset();
        setEditMode && setEditMode(false);
        setShowNewForm && setShowNewForm(false);
    }

    return (
        <form id="reference-form" ref={form}>
            <div className='row row-cols-2 justify-content-center mb-2'>
                <div className='col col-3'>
                    <label htmlFor='ref-avatar'></label>
                </div>
                <div className='col col-5'>
                    <input 
                        type='file' 
                        id='ref-avatar' 
                        name='img' 
                        className='form-control' 
                        accept='.jpg, .jpeg, .png, .gif, .svg'
                        onChange={e =>
                            e.target.files && setImage(e.target.files[0])
                        }
                    />
                </div>
            </div>
            <div className='row row-cols-2 justify-content-center mb-2'>
                <div className='col col-3'>
                    <label htmlFor='ref-name'>Name</label>
                </div>
                <div className='col col-5'>
                    <input id='ref-name' className='form-control' value={refName} onChange={e => setRefName(e.target.value)} required/>
                </div>
            </div>
            <div className='row row-cols-2 justify-content-center mb-2'>
                <div className='col col-3'>
                    <label htmlFor='ref-affiliation'>Affiliation</label>
                </div>
                <div className='col col-5'>
                    <input id='ref-affiliation' className='form-control' value={refAffiliation} onChange={e => setRefAffiliation(e.target.value)} required/>
                </div>
            </div>
            <div className='row row-cols-2 justify-content-center mb-2'>
                <div className='col col-3'>
                    <label htmlFor='ref-affiliation'>Content</label>
                </div>
                <div className='col col-5'>
                    <textarea id='ref-content' className='form-control' value={refContent} onChange={e => setRefContent(e.target.value)} required></textarea>
                </div>
            </div>
            <div className='row justify-content-center mb-2'>
                { error !== '' ?
                    <div className='col col-5'>
                        <div className='alert alert-danger' role='alert' id="invalid-alert">
                            <p>Upload failed. {error}</p>
                        </div>
                    </div>
                    : null
                }
            </div>
            <div className="row justify-content-center">
                <div className="col col-sm-6 text-end">
                    <AdminButton buttonText='Save' buttonClass='btn-success' clickHandle={handleSubmit} />
                </div>
                <div className="col col-sm-6 text-start">
                    <AdminButton buttonText='Cancel' buttonClass='btn-danger' clickHandle={handleCancel} />
                </div>    
            </div>
        </form>
    );
    
};

export default ReferenceForm;