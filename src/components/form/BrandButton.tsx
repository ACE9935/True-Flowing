import Image from 'next/image';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    url:string
    children: ReactNode;
}

function BrandButton({url,children,...props}:ButtonProps) {
    return ( 
        <button {...props} className='p-3 flex items-center justify-center font-semibold gap-3 border-2 rounded-lg'>
            <Image alt="Google logo" src={url} width={30}height={30}/>
            <p>{children}</p>
        </button>
     );
}

export default BrandButton