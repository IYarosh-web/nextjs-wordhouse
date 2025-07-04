import React from 'react';

const Input = (props:  React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) => {
  return (
    <input className='peer block w-full rounded-md border border-gray-200 py-2 pl-10' {...props} />
  )
}

export { Input };