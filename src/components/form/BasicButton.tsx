import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
}

function BasicButton({children,...props}:ButtonProps) {
    return ( 
        <button {...props} className='bg-primary-color rounded-xl !text-white p-4 font-bold'>{children}</button>
     );
}

export default BasicButton