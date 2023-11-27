import React, { useContext, useEffect, useState } from 'react';
import requestServices from '../requestServices';
import ReferenceThumb from './ReferenceThumb';
import './References.css';
import { authContext } from '../App';
import ReferenceForm from './Admin/ReferenceForm';
import AdminButton from './Admin/AdminButton';

const References = () => {
    const auth = useContext(authContext).auth;
    const [updated, setUpdated] = useState(true);
    const [references, setReferences] = useState(Array<IReference>);
    const [workedWithImg, setWorkedWithImg] = useState('');
    const [showNewForm, setShowNewForm] = useState(false);

    useEffect(() => {
        if(updated) {
            requestServices.getReferences()
                .then(response => {
                    setReferences(response[0]);
                    setWorkedWithImg(response[1].path);
                    setUpdated(false);
                });
        }
    }, [updated]);

    return (
        <div className="container">
            <h1>I&apos;ve previously worked with</h1>
            <div>
                {workedWithImg === '' ? null : <img src={workedWithImg} className='w-75' />}
            </div>
            <h1>References</h1>

            {references.length > 0 ? references.map(reference => <ReferenceThumb key={reference._id}  reference={reference} setUpdated={setUpdated}/>) : <p>loading</p>}

            <>
                {auth.auth? 
                    <>
                        {showNewForm ?<ReferenceForm setUpdated={setUpdated} setShowNewForm={setShowNewForm} /> : null}
                        <AdminButton buttonText='Add new' buttonClass='btn-light' clickHandle={() => setShowNewForm(true)} />
                    </>
                    : null}
            </>
        </div>
    );
};

export default References;