import React, { useContext, useEffect, useState, useRef } from 'react';
import requestServices from '../../requestServices';
import { authContext } from '../../App';
import AdminButton from './AdminButton';



type WorkExampleFormParams = {
    id?: string | undefined,
    setUpdated: React.Dispatch<React.SetStateAction<boolean>>,
    setEditMode?: React.Dispatch<React.SetStateAction<boolean>> | undefined
    setShowNewForm?: React.Dispatch<React.SetStateAction<boolean>> | undefined
};

const WorkExampleForm = ({id, setUpdated, setEditMode, setShowNewForm}: WorkExampleFormParams) => {
    const [file, setFile] = useState<File | null>(null);
    const [occasionText, setOccasionText] = useState('');
    const [error, setError] = useState('');
    const [form, setForm] = useState(useRef<HTMLFormElement | null>(null));

    const jwt = useContext(authContext).jwt;

    useEffect(() => {
        setForm(form);
        if(id) {
            requestServices.getWorkAudio(id)
                .then((response: IWorkExample[]) => {
                    setOccasionText(response[0].occasions);
                })
                .catch(e => console.log(e.message));
        }
    }, []);

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const isFormValid = form.current?.checkValidity();
        if(!isFormValid) form.current && form.current.reportValidity();
        else {
            e.preventDefault();
            
            const formData = new FormData();
            file && formData.append('work-audio', file);
            formData.append('occasions', occasionText);
            formData.append('tag', 'work');

            if(id) {
                console.log(id);
                if(!file) {
                    requestServices.updateWorkAudio(id, jwt, undefined, occasionText)
                        .then(() => setUpdated(true))
                        .catch(e => {
                            console.log(e);
                        })
                        .finally(() => {
                            setFile(null);
                            form.current && form.current.reset();
                        });
                } else {
                    requestServices.uploadWorkAudio(formData, jwt)
                        .then(response => {
                            console.log(response);
                            if(response.status !== 201) {
                                setError(response.data);
                            } else {
                                requestServices.updateWorkAudio(id, jwt, response.data, occasionText)
                                    .then(() => setUpdated(true))
                                    .catch(e => {
                                        console.log(e);
                                    })
                                    .finally(() => {
                                        setFile(null);
                                        setOccasionText('');
                                        form.current && form.current.reset();
                                    });
                            }});
                }
                setEditMode && setEditMode(false);
            } else {
                requestServices.uploadWorkAudio(formData, jwt)
                    .then(response => {
                        console.log(response);
                        if(response.status !== 201) {
                            setError(response.data);
                        } else {
                            requestServices.writeNewWorkAudio(response.data, jwt)
                                .then(() => setUpdated(true))
                                .catch(e => {
                                    console.log(e);
                                })
                                .finally(() => {
                                    setFile(null);
                                    setOccasionText('');
                                    form.current && form.current.reset();
                                });
                        }});
            }

        }
    };

    function handleCancel (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
        setFile(null);
        setOccasionText('');
        setError('');
        form.current && form.current.reset();
        setEditMode && setEditMode(false);
        setShowNewForm && setShowNewForm(false);
    }

    return (
        <form id="work-example-form" ref={form}>
            <div className='row mb-2'>
                <div className='col col-2 col-md-4 text-end'>
                    <label>File</label>
                </div>
                <div className='col col-8 col-md-4'>
                    { id ? 
                        <input
                            name='work-audio'
                            type='file' 
                            className='form-control'
                            accept='.mp3, .wav, .ogg'
                            onChange={e => {
                                e.target.files && setFile(e.target.files[0]);
                            }}
                        />
                        :
                        <input
                            name='work-audio'
                            type='file' 
                            className='form-control'
                            accept='.mp3, .wav, .ogg'
                            onChange={e => {
                                e.target.files && setFile(e.target.files[0]);
                            }}
                            required
                        />}
                </div>
            </div>

            <div className='row mb-2'>
                <div className='col col-2 col-md-4 text-end'>
                    <label htmlFor='occasions'>Occasions</label>
                </div>
                <div className='col col-8 col-md-4'>
                    <textarea 
                        id='occasions' 
                        className='form-control'
                        value={occasionText}
                        onChange={e => {
                            setOccasionText(e.target.value);
                        }}
                        required></textarea>
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

            <div className="row justify-content-center mb-3">
                <div className="col col-sm-2">
                    <AdminButton buttonText='Save' buttonClass='btn-primary' clickHandle={handleSubmit}/>
                </div>
                <div className="col col-sm-2">
                    <AdminButton buttonText='Cancel' buttonClass='btn-danger' clickHandle={handleCancel} />
                </div>    
            </div>
        </form>
    );
    
};

export default WorkExampleForm;