import React from 'react';
import { Link } from 'react-router-dom';

type ContactSuccessProps = {
    formData: {
        name: string,
        company: string,
        email: string,
        phone: string,
        purpose: string,
        startDate: null | Date,
        endDate: null | Date,
        body: string
    }
};

const ContactSentSuccessfully = ({formData}: ContactSuccessProps) => {
    return (
        <div className="container">
            <div className='text-start'>
                <Link to={'/'}> <p>← Back to front page</p></Link>
            </div>

            <h1>Your inquiry was sent!</h1>
            <div className='mt-3 w-50 text-start mx-auto'>
                <div className="row">
                    <div className="col">
                        <p>Name: <span>{formData.name}</span></p>
                    </div>
                    <div className="col">
                        <p>Company: <span>{formData.company}</span></p>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <p>Email: <span>{formData.email}</span></p>
                    </div>
                    <div className="col">
                        <p>Phone: <span>{formData.phone}</span></p>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <p>Purpose of inqury: <span>{formData.purpose}</span></p>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <p>Dates: <span>{formData.startDate?.toLocaleDateString()}</span> - <span>{formData.endDate?.toLocaleDateString()}</span></p>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <p><span>{formData.body}</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactSentSuccessfully;