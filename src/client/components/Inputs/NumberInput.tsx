import React from 'react';

type NumberInputProps = {
    inputId: string,
    label?: string | undefined,
    value: string,
    min?: string | undefined,
    max?: string | undefined,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    autofocus?: boolean | undefined,
    required?: boolean | undefined
}

const NumberInput = ({inputId, label, value, min, max, onChange, autofocus, required}: NumberInputProps) => {
    return (
        <div className='row'>
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
                    type="number" 
                    className="form-control" 
                    value={value} 
                    min={min}
                    max={max}
                    onChange={onChange}
                    autoFocus={autofocus || false}
                    required={required || false}
                />
            </div>
        </div>
    );
};

export default NumberInput;