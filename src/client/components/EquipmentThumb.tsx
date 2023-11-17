import React from 'react';

type EquipmentThumbProps = {
    name: string,
    specs: string
    individuals: Array<string | IEquipmentChild>
};

const EquipmentTumb = ({name, specs, individuals}: EquipmentThumbProps) => {
    return (<div className="card">
        <div className="col">
            <div>
                jflbjflkgjbgfljhlk
            </div>
        </div>
        <div className="col">
            <h3>{name}</h3>
            <p>{specs}</p>
            <p>Quantity:  {individuals.length}</p>
        </div>
    </div>);
};

export default EquipmentTumb;