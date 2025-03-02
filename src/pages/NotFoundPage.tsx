import { FC } from 'react';

const NotFoundPage: FC = () => {
    return (
        <div className='m-auto max-w-[720px] p-[50px] xl:p-[100px] text-center'>
            <h1 className='text-3xl xl:text-4xl '>
                <span className='text-5xl'>😕</span>
                <br />
                <b className='dark:text-white'>Ничего не найдено</b>
            </h1>
            <p className="text-[22px] text-slate-600 mt-3 dark:text-slate-300">
                К сожалению данная страница отсутствует в нашем интернет-магазине
            </p>
        </div>
    );
};

export default NotFoundPage;