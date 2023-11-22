import React, { useContext } from 'react';
import { authContext } from '../../App';

type AdminNavProps = {
    username: string
};

const AdminNav = ({username}: AdminNavProps) => {
    const setJwt = useContext(authContext).setJwt;

    const handleLogout = () => {
        setJwt && setJwt('');
    };

    return (
        <>{username !== '' ?
            <div className="admin-nav row justify-content-between">
                <div className="col col-2"></div>
                <div className="col col-8 pt-1">Welcome, {username}!</div>
                <div className="col col-2"><button className='btn text-light' onClick={handleLogout}>Logout</button></div>
            </div>: null}
        </>
    );
};

export default AdminNav;