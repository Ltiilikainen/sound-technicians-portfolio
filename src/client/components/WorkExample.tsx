import React, { useContext, useState } from 'react';
import AudioPlayer from './AudioPlayer/AudioPlayer';
import requestServices from '../requestServices';
import WorkExampleForm from './Admin/WorkExampleForm';
import { authContext } from '../App';
import AdminButton from './Admin/AdminButton';

type WorkExampleProps = {
    file: IWorkExample,
    setUpdated: React.Dispatch<React.SetStateAction<boolean>>
};

const WorkExample = ({file, setUpdated}: WorkExampleProps) => {
    const auth = useContext(authContext).auth;
    const token = useContext(authContext).jwt;
    const [editMode, setEditMode] = useState(false);

    function handleDelete() {
        requestServices.deleteWorkAudio(String(file._id), token)
            .catch(e => console.log(e))
            .then(response => {
                console.log(response);
                setUpdated(true);
            });
    }

    return (
        <>
            {auth.auth ? 
                <div className='row row-cols-2 row-cols-md-3'>
                    {editMode ?
                        <div className='col col-12 col-md-10'>
                            <WorkExampleForm id={String(file._id)} setUpdated={setUpdated} setEditMode={setEditMode} />
                        </div>
                        :
                        <>
                            <div className='col col-10 col-md-6'>
                                <AudioPlayer audiopath={`../../${file.file.path}`}/>
                            </div>
                            <div className='col col-md-4 text-start pt-3'>
                                <h3>Occasions</h3>
                                <p>{file.occasions}</p>
                            </div>
                        </>
                    }
                    <div className='col col-md-2 text-start'>
                        {editMode ? null : <AdminButton buttonText='Edit' buttonClass='btn-secondary' clickHandle={() => setEditMode(true)} />}
                        <AdminButton buttonText='Delete' buttonClass='btn-danger' clickHandle={handleDelete} />
                    </div>
                </div>
                :
                <div className='row row-cols-md-2'>
                    <div className='col col-12 col-md-7'>
                        <AudioPlayer audiopath={`../../${file.file.path}`}/>
                    </div>
                    <div className='col col-12 col-md-5 text-start pt-3'>
                        <h3>Occasions</h3>
                        <p>{file.occasions}</p>
                    </div>
                </div>}
        </>
    );

};

export default WorkExample;