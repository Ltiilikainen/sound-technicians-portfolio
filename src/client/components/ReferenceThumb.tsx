import React from 'react';

type ReferenceThumbProps = {
    reference: IReference
}

const ReferenceThumb = ({reference} : ReferenceThumbProps) => {
    return (
        <div className='ref-thumb'>
            <div className="ref-img">
                {typeof reference.image === 'object' ? <img src={reference.image.path} /> : null}
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
    );
};

export default ReferenceThumb;