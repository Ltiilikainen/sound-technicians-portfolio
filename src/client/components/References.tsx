import React, { useEffect, useState } from 'react';
import requestServices from '../requestServices';
import ReferenceThumb from './ReferenceThumb';
import './References.css';

const References = () => {
    const [references, setReferences] = useState(Array<IReference>);
    const [workedWithImg, setWorkedWithImg] = useState('');

    useEffect(() => {
        requestServices.getReferences()
            .then(response => {
                setReferences(response[0]);
                setWorkedWithImg(response[1].path);
            });
    }, []);

    return (
        <div className="container">
            <h1>I&apos;ve previously worked with</h1>
            <div>
                {workedWithImg === '' ? null : <img src={workedWithImg} className='w-75' />}
            </div>
            <h1>References</h1>

            {references.length > 0 ? references.map(reference => <ReferenceThumb key={reference._id}  reference={reference}/>) : <p>loading</p>}
        </div>
    );
};

export default References;