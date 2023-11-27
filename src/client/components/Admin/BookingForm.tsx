import React from 'react';

const BookingForm = () => {

    return (
        <form id="booking-form">

            <div className="row">
                <div className="col col-sm-6">
                    <button className='btn btn-success'>Save</button>
                </div>
                <div className="col col-sm-6">
                    <button className='btn btn-danger'>Cancel</button>
                </div>    
            </div>
        </form>
    );
    
};

export default BookingForm;