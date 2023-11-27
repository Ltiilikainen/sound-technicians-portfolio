import React, { useContext, useState } from 'react';
import { authContext } from '../App';
import requestServices from '../requestServices';
import ReferenceForm from './Admin/ReferenceForm';
import AdminButton from './Admin/AdminButton';

type ReferenceThumbProps = {
    reference: IReference,
    setUpdated: React.Dispatch<React.SetStateAction<boolean>>,
}

const ReferenceThumb = ({reference, setUpdated} : ReferenceThumbProps) => {
    const auth = useContext(authContext).auth;
    const [editMode, setEditMode] = useState(false);

    const token = useContext(authContext).jwt;

    function handleDelete() {
        requestServices.deleteReference(reference._id, token)
            .catch(e => console.log(e))
            .then(response => {
                console.log(response);
                setUpdated(true);
            });
    }

    return (
        <> 
            {auth.auth  ? 
                <>
                    {editMode ? 
                        <ReferenceForm id={reference._id} setUpdated={setUpdated} setEditMode={setEditMode} />
                        : <div className='row justify-content-center'>
                            <div className='col col-8'>
                                <div className='ref-thumb'>
                                    <div className="ref-img">
                                        {reference.image && typeof reference.image === 'object' ? <img src={reference.image.path} /> : null}
                                    </div>
                                    <div className="ref-person">
                                        <p className="ref-name">{reference.name}</p>
                                        <p className="ref-affiliation">{reference.affiliation}</p>
                                    </div>
                                    <div className="ref-card">
                                        <div className="ref-text">
                            &rdquo;{reference.content}&ldquo;
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='col col-2'>
                                {editMode ? null : <AdminButton buttonText='Edit' buttonClass='btn-primary' clickHandle={() => setEditMode(true)} />}
                                <AdminButton buttonText='Delete' buttonClass='btn-danger' clickHandle={handleDelete} />
                            </div> 
                        </div>
                
                    } 
                </>
                : <div className='ref-thumb'>
                    <div className="ref-img">
                        {reference.image && typeof reference.image === 'object' ? <img src={reference.image.path} /> : null}
                    </div>
                    <div className="ref-person">
                        <p className="ref-name">{reference.name}</p>
                        <p className="ref-affiliation">{reference.affiliation}</p>
                    </div>
                    <div className="ref-card">
                        <div className="ref-text">
                    &rdquo;{reference.content}&ldquo;
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default ReferenceThumb;