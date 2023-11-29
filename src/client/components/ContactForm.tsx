import React, {useState} from 'react';
import TextInput from './Inputs/TextInput';
import DateInput from './Inputs/DateInput';
import requestServices from '../requestServices';
import ContactSentSuccessfully from './ContactSentSuccessfully';

const ContactForm = () => {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
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
            try {
                requestServices.sendForm(formData);
                setSuccess(true);
            } catch (e) {
                setError('Something went wrong!');
            }
        }
    };

    return (
        <>
            {success && <ContactSentSuccessfully  formData={formData}/>}
            {!success &&
            
        <div className="container">
            <h1>Contact me</h1>
            <div className='row text-start'>
                <small>Required fields are marked with *</small>
            </div>
            <form className='form-group' id='contact'>
                <div className='row row-cols-md-2 my-3'>
                    <div className='col col-md-6 text-start'>
                        <TextInput 
                            inputId='name'
                            label='Name *'
                            onChange={handleChange}
                            required={true}
                            autofocus={true}
                        />
                    </div>
                    <div className='col col-md-6 text-start'>
                        <div className='form-group row align-items-start'>
                            <TextInput 
                                inputId='company'
                                label='Company'
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>
                <div className='row row-cols-md-2 mb-3'>
                    <div className='col col-md-6 text-start'>
                        <TextInput 
                            inputId='email'
                            label='Email *'
                            type='email'
                            onChange={handleChange}
                            required={true}
                        />
                    </div>
                    <div className='col col-md-6 text-start'>
                        <TextInput 
                            inputId='phone'
                            label='Phone *'
                            type='telephone'
                            onChange={handleChange}
                            required={true}
                        />
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
                <div className='row mb-4'>
                    <div className="col">
                        <DateInput 
                            inputId='start-date'
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col">
                        <DateInput 
                            inputId='end-date'
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <textarea className='form-control mb-3' id='body' onChange={handleChange} rows={4} required></textarea>
                <div className='row justify-content-center mb-2'>
                    { error !== '' ?
                        <div className='col col-5'>
                            <div className='alert alert-danger' role='alert' id="invalid-alert">
                                <p>{error} Please try again later.</p>
                            </div>
                        </div>
                        : null
                    }
                </div>
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
            }
        </>
    );
};

export default ContactForm;