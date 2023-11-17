import React, { useEffect, useState } from 'react';
import requestServices from '../requestServices';
import EquipmentTumb from './EquipmentThumb';

const EquipmentList = () => {
    const [equipment, setEquipment] = useState(Array<IEquipment>);

    useEffect(() => {
        requestServices.getAllEquipment()
            .then(result => {
                setEquipment(result);
            });
    }, []);


    return (
        <div className="container">
            <h1>Equipment List</h1>

            {
                equipment.map(item => <EquipmentTumb key={item._id} name={item.name} specs={item.specs} individuals={item.individuals} />)
            }

        </div>
    );
};

export default EquipmentList;