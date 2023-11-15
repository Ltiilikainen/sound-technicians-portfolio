import React, {useState} from 'react';
import requestServices from '../requestServices';

const ContactForm = () => {

    const [formData, setFormData] = useState<IFormData>({
        name: '',
        company: '',
        email: '',
        phone: '',
        purpose: '',
        startDate: null,
        endDate: null,
        body: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        const {id, value} = e.target;
        setFormData((prevFormData) => ({...prevFormData, [id]: value}));
    };

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const form = document.getElementById('contact');
        const isFormValid = (form as HTMLFormElement).checkValidity();
        if(!isFormValid) (form as HTMLFormElement).reportValidity();
        else {
            e.preventDefault();
            requestServices.sendForm(formData);
            console.log(formData);
        }
    };

    return (
        <div className="container">
            <h1>Contact me</h1>
            <div className='row text-start'>
                <small>Required fields are marked with *</small>
            </div>
            <form className='form-group' id='contact'>
                <div className='row row-cols-md-2 my-3'>
                    <div className='col col-md-6 text-start'>
                        <div className='form-group row align-items-start'>
                            <div className='col-3'>
                                <label className='form-label' htmlFor="name">Name *</label>
                            </div>
                            <div className='col'>
                                <input className='form-control' onChange={handleChange} id="name" required></input>
                            </div>
                        </div>
                    </div>
                    <div className='col col-md-6 text-start'>
                        <div className='form-group row align-items-start'>
                            <div className='col-auto'>
                                <label className='form-label' htmlFor="company">Company</label>
                            </div>
                            <div className='col'>
                                <input className='form-control' onChange={handleChange} id="company"></input>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row row-cols-md-2 mb-3'>
                    <div className='col col-md-6 text-start'>
                        <div className='form-group row align-items-start'>
                            <div className='col-3'>
                                <label className='form-label' htmlFor="email">Email *</label>
                            </div>
                            <div className='col'>
                                <input className='form-control' onChange={handleChange} type="email" id="email" required></input>
                            </div>
                        </div>
                    </div>
                    <div className='col col-md-6 text-start'>
                        <div className='form-group row align-items-start'>
                            <div className='col-3'>
                                <label className='form-label' htmlFor="phone">Phone *</label>
                            </div>
                            <div className='col'>
                                <input className='form-control' onChange={handleChange} type='telephone' id="phone" required></input>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='form-group row align-items-start'>
                    <div className='col-2'>
                        <label className='form-label' htmlFor="purpose">Purpose of inquiry *</label>
                    </div>
                    <div className='col'>
                        <input className='form-control' onChange={handleChange} id="purpose" required></input>
                    </div>
                </div>
                <div className='row'>
                    <label className='form-label' htmlFor='dates'>Dates</label>
                </div>
                <div className='row row-cols-3 mb-4 justify-content-center'>
                    <div className='col col-5 d-flex justify-content-end'>
                        <input className='form-control w-50' onChange={handleChange} type='date' name='dates' id='startDate'></input>
                    </div>
                    <div className='col col-1'>
                        <span>-</span>
                    </div>
                    <div className='col col-5'>
                        <input className='form-control w-50' onChange={handleChange} type='date' name='dates' id='endDate'></input>
                    </div>
                </div>
                <textarea className='form-control mb-3' id='body' onChange={handleChange} rows={4} required></textarea>
                <div className='row justify-content-center'>
                    <div className='col col-12 mb-3'>
                        <button type='submit' className='btn btn-light btn-lg w-75' onClick={handleSubmit}>Submit</button>
                    </div>
                    <div className='col col-12'>
                        <button type='reset' className='btn btn-outline-light'>Clear form</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ContactForm;