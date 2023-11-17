import React from 'react';

type EquipmentInfoProps = {
    equipment: IEquipment | null
};
const EquipmentInfo = ({equipment}: EquipmentInfoProps) => {
    return (
        <div className='row row-cols-2'>
            <div className='col col-3'>
                <div className='equipment-img'>
                </div>
            </div>
            <div className='col col-9'>
                {equipment ? <div>
                    <h3>{equipment.name}</h3>

                    <p>{equipment.specs}</p>
                </div>
                    : <span>loading...</span>}
            </div>
        </div>
    );
};

export default EquipmentInfo;