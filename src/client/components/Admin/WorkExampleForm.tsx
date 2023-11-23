import React, { useContext, useEffect, useState } from 'react';
import requestServices from '../../requestServices';
import { authContext } from '../../App';



type WorkExampleFormParams = {
    id: string | undefined,
    setUpdated: React.Dispatch<React.SetStateAction<boolean>>
};

const WorkExampleForm = ({id, setUpdated}: WorkExampleFormParams) => {
    const [file, setFile] = useState<File | null>(null);
    const [occasionText, setOccasionText] = useState('');
    const [error, setError] = useState('');

    const jwt = useContext(authContext).jwt;

    useEffect(() => {
        if(id) {
            requestServices.getWorkAudio(id)
                .then((response: IWorkExample[]) => {
                    setOccasionText(response[0].occasions);
                })
                .catch(e => console.log(e.message));
        }
    }, []);

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const form = document.getElementById('work-example-form');
        const isFormValid = (form as HTMLFormElement).checkValidity();
        if(!isFormValid) (form as HTMLFormElement).reportValidity();
        else {
            e.preventDefault();
            
            const formData = new FormData();
            file && formData.append('work-audio', file);
            formData.append('occasions', occasionText);
            formData.append('tag', 'work');

            requestServices.uploadWorkAudio(formData, jwt)
                .then(response => {
                    console.log(response);
                    if(response.status !== 201) {
                        setError(response.data);
                        (document.getElementById('invalid-alert') as HTMLElement).style.visibility = 'visible';
                    } else {
                        requestServices.writeNewWorkAudio(response.data, jwt)
                            .then(() => setUpdated(true))
                            .catch(e => {
                                console.log(e);
                            })
                            .finally(() => {
                                setFile(null);
                                setOccasionText('');
                                (form as HTMLFormElement).reset();
                            });
                    }});
        }
    };

    return (
        <form id="work-example-form">
            <div className='row mb-2'>
                <div className='col col-sm-4 text-end'>
                    <label htmlFor='work-file'>File</label>
                </div>
                <div className='col col-sm-4'>
                    <input 
                        id='work-file'
                        name='work-audio'
                        type='file' 
                        className='form-control'
                        accept='.mp3, .wav, .ogg'
                        onChange={e => {
                            e.target.files && setFile(e.target.files[0]);
                        }}
                        required
                    />
                </div>
            </div>

            <div className='row mb-2'>
                <div className='col col-sm-4 text-end'>
                    <label htmlFor='occasions'>Occasions</label>
                </div>
                <div className='col col-sm-4'>
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
                <div className='col col-5'>
                    <div className='alert alert-danger' role='alert' id="invalid-alert" style={{visibility: 'hidden'}}>
                        <p>Upload failed. {error}</p>
                    </div>
                </div>
            </div>

            <div className="row justify-content-center mb-3">
                <div className="col col-sm-2">
                    <button className='btn btn-success' onClick={handleSubmit}>Save</button>
                </div>
                <div className="col col-sm-2">
                    <button className='btn btn-danger'>Cancel</button>
                </div>    
            </div>
        </form>
    );
    
};

export default WorkExampleForm;