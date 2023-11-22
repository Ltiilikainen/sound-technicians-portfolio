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
            <div className="admin-nav">
                <div className="row justify-content-between">
                    <div className="col col-2"></div>
                    <div className="col col-8">Welcome, {username}</div>
                    <div className="col col-2"><button className='btn' onClick={handleLogout}>Logout</button></div>
                </div>
            </div> : null}
        </>
    );
};

export default AdminNav;