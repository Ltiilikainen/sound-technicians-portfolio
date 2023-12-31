import React, { useContext, useState } from 'react';
import requestServices from '../../requestServices';
import { authContext } from '../../App';
import { Navigate } from 'react-router-dom';
import TextInput from '../Inputs/TextInput';

const AdminLogin = () => {
    const [success, setSuccess] = useState(false);
    const [loginusername, setLoginUsername] = useState('');
    const [password, setPassword] = useState('');
    const setJwT = useContext(authContext).setJwt;
    const setRsaPub = useContext(authContext).setRsaPub;

    const handleLogin = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const form = document.getElementById('login');
        const isFormValid = (form as HTMLFormElement).checkValidity();
        if(!isFormValid) (form as HTMLFormElement).reportValidity();
        else {
            e.preventDefault();
            requestServices.loginAdmin(loginusername, password)
                .then(data => {
                    if (!data.verification) {
                        (document.getElementById('invalid-alert') as HTMLElement).style.visibility = 'visible';
                    } else {
                        setJwT && setJwT(data.info.token);
                        setRsaPub && setRsaPub(data.info.pub_key);
                        setSuccess(true);
                    }
                });
        }
    };

    return (
        <div className="container">
            {success && (<Navigate to='/' replace={true} />)}
            <form id="login" className='form-group'>
                <div className="row justify-content-center mb-2">
                    <TextInput 
                        inputId='username'
                        label='Username'
                        value=''
                        onChange={e => setLoginUsername(e.target.value)}
                        required={true}
                        autofocus={true}
                    />
                </div>
                <div className="row justify-content-center mb-2">
                    <TextInput 
                        inputId='password'
                        label='Password'
                        type='password'
                        value=''
                        onChange={e => setPassword(e.target.value)}
                        required={true}
                    />
                </div>
                <div className='row justify-content-center'>
                    <div className='col col-sm-4'>
                        <div className='alert alert-danger' role='alert' id="invalid-alert" style={{visibility: 'hidden'}}>Incorrect username or password</div>
                    </div>
                </div>
                <button className="btn btn-light" onClick={handleLogin}>Login</button>
            </form>
        </div>
    );
};

export default AdminLogin;