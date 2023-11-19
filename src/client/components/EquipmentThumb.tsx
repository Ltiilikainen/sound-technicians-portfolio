import React from 'react';
import { Link } from 'react-router-dom';

type EquipmentThumbProps = {
    id:string,
    name: string,
    img: string | IFile,
    specs: string
    individuals: Array<string | IEquipmentChild>
};

const EquipmentTumb = ({id, name, img, specs, individuals}: EquipmentThumbProps) => {
    return (
        <div className="card equipment-card mb-2">
            <div className='row'>
                <div className="col col-4 py-2 px-3">
                    <div className='equipment-img'>
                        {typeof img === 'object' ? <img src={(img as IFile).path} /> : null}
                    </div>
                </div>
                <div className="col col-8 text-start">
                    <Link to={`/equipment/${id}`}> <h3>{name}</h3></Link>
                    <p>{specs}</p>
                    <p>Quantity:  {individuals.length}</p>
                </div>
            </div>
        </div>);
};

export default EquipmentTumb;