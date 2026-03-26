import React from 'react'

const FromGroup = ({label, placeholder, value, onChange}) => {
  return (
    <div className="form-group">
        <label htmlFor={label}>{label}</label>
        <input 
          type="text" 
          id={label} 
          name={label} 
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          />
    </div>
  )
}

export default FromGroup