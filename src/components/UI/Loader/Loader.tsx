import { LoaderCircle } from 'lucide-react';
import { FC } from 'react';

const Loader: FC = () => {
    return (
        <div className='flex justify-center w-full'>
          <LoaderCircle className='animate-spin' strokeWidth={2} color='#0891b2' size={30} />
        </div>
    );
};

export default Loader;