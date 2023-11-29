import React from 'react';

type TextInputProps = {
    inputId: string,
    label?: string | undefined,
    type?: string | undefined,
    value?: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    autofocus?: boolean | undefined,
    required?: boolean | undefined
}

const TextInput = ({inputId, label, type, value, onChange, autofocus, required}: TextInputProps) => {
    return (
        <div className='row justify-content-center'>
            {label ?
                <div className="col col-auto">
                    <label htmlFor={inputId} className="col-form-label">
                        {label}
                    </label>
                </div>
                : null
            }
            <div className="col col-auto">
                <input 
                    id={inputId}
                    type={type || 'text'} 
                    className="form-control" 
                    value={value || undefined} 
                    onChange={onChange}
                    autoFocus={autofocus || false}
                    required={required || false}
                />
            </div>
        </div>
    );
};

export default TextInput;