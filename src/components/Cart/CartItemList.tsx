import { useAutoAnimate } from '@formkit/auto-animate/react';
import { FC } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/hooksRedux';
import { removeProduct } from '../../redux/slices/cartSlice';

const CartItemList: FC = () => {
    const [animationParent] = useAutoAnimate()
    const dispatch = useAppDispatch()
    const items = useAppSelector(state => state.cart.items)

    return (
        <div className="flex flex-col flex-1 gap-3 xl:gap-5" ref={animationParent}>
            {items.map(item => (
                <div key={item._id} className="flex shadow-sm items-center border border-slate-200 p-4 rounded-xl gap-4">
                    <div className='dark:bg-gray-300 rounded p-1'>
                        <img 
                            className="w-16 h-16 mix-blend-multiply object-contain object-center" 
                            src={`http://localhost:5000${item.imageUrl}`} 
                            alt="items" 
                        />
                    </div>
        
                    <div className="flex flex-col flex-1 dark:text-white">
                        <p className='text-sm xl:text-base'>{item.title}</p>
        
                        <div className="flex justify-between mt-2">
                            <b className="flex-1 ">{item.price} руб.</b>
                            <img onClick={() => dispatch(removeProduct(item))} className="opacity-40 hover:opacity-100 transition cursor-pointer"
                                src="/img/close.svg" alt="close" />
                        </div>
                    </div>
                    
                </div>
            ))}
        </div>
    );
};

export default CartItemList;