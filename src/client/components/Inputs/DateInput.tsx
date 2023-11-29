import React from 'react';

type DateInputProps = {
    inputId: string,
    ref?: React.RefObject<HTMLInputElement> | undefined,
    label?: string | undefined,
    value?: string | undefined,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    autofocus?: boolean | undefined,
    required?: boolean | undefined
}

const DateInput = ({inputId, ref, label, value, onChange, autofocus, required}: DateInputProps) => {
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
                    ref={ref || undefined}
                    type="date" 
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

export default DateInput;