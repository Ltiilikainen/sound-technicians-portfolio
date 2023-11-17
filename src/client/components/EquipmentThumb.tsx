import React from 'react';
import { Link } from 'react-router-dom';

type EquipmentThumbProps = {
    id:string,
    name: string,
    specs: string
    individuals: Array<string | IEquipmentChild>
};

const EquipmentTumb = ({id, name, specs, individuals}: EquipmentThumbProps) => {
    return (
        <div className="card">
            <div className="col">
                <div>
                jflbjflkgjbgfljhlk
                </div>
            </div>
            <div className="col">
                <Link to={`/equipment/${id}`}> <h3>{name}</h3></Link>
                <p>{specs}</p>
                <p>Quantity:  {individuals.length}</p>
            </div>
        </div>);
};

export default EquipmentTumb;