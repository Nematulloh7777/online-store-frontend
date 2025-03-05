import { FC } from 'react';

interface ErrorProps {
    errorText?: string;
}

const Error: FC<ErrorProps> = ({errorText}) => {
    return (
        <div className='col-span-4 flex flex-col items-center'>
           <span className='text-2xl font-bold text-red-600 dark:text-red-400'>{errorText}</span>
            <span className='text-slate-400'>Проверьте подключение к интернету или попробуйте позже</span>
        </div>
    );
};

export default Error;