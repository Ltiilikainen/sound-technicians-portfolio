import React from 'react';

type AdminButtonProps = {
    buttonText: string,
    buttonClass: string,
    clickHandle: ((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | (() => void)
};

const AdminButton = ({buttonText, buttonClass, clickHandle}: AdminButtonProps) => {

    return (
        <button className={`btn ${buttonClass}`} onClick={clickHandle}>{buttonText}</button>
    );
};

export default AdminButton;