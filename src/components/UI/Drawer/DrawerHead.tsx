import { ArrowLeft, Trash2 } from 'lucide-react';
import { FC } from 'react';
import { Tooltip } from 'react-tooltip';
import { useAppDispatch } from '../../../hooks/hooksRedux';
import { clearCart, clickOrderId } from '../../../redux/slices/cartSlice';

interface DrawerHeadProps {
    totalPrice: number;
    drawerClose: (state?: any) => void;
}

const DrawerHead: FC<DrawerHeadProps> = ({drawerClose, totalPrice}) => {
    const dispatch = useAppDispatch()

    const onClickBack = () => {
        drawerClose()
        dispatch(clickOrderId(''))
    }
    
    return (
        <div className="sticky top-0 z-40 bg-white dark:bg-[#0f172a] h-20 flex items-center gap-5 p-4 border-b border-slate-200 shadow-lg">
            <ArrowLeft size={28} onClick={onClickBack} className="opacity-30 cursor-pointer transition dark:opacity-70 dark:hover:opacity-100 dark:text-white hover:-translate-x-1 hover:opacity-100" />
            
            <h2 className="text-xl xl:text-2xl font-bold dark:text-white">Корзина</h2>

            <div className='flex ml-2 flex-row flex-1 justify-end'>
                {totalPrice ? (
                    <>
                        <Trash2
                            color="#ccc"
                            size={22}
                            className="hover:opacity-70 mr-2 focus:outline-none transition cursor-pointer"
                            id="trashIcon"
                            onClick={() => dispatch(clearCart())}
                        />
                        <Tooltip
                            anchorSelect="#trashIcon"
                            place="bottom-start"
                            content="Очистить всю корзину"
                            className='dark:text-black dark:bg-white'
                        />
                    </>
                ) : ''}
            </div>

        </div>
    );
};

export default DrawerHead;