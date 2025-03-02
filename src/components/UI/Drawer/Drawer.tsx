import { FC, useEffect, useState } from 'react';
import useAnimatedNumber from './useAnimatedNumber';
import { useAppSelector } from '../../../hooks/hooksRedux';
import DrawerHead from './DrawerHead';
import InfoBlock from '../../InfoBlock';
import CartItemList from '../../Cart/CartItemList';

interface DrawerProps {
    isOpen: boolean;
    drawerClose: (state: any) => void;
}

const Drawer: FC<DrawerProps> = ({drawerClose, isOpen}) => {
    const { totalPrice, orderId, items } = useAppSelector(state => state.cart);
    const vatPrice = Math.round((totalPrice * 5) / 100);
    const totalPayment = totalPrice + vatPrice;

    const [drawerState, setDrawerState] = useState(isOpen);

    const animatedTotalPrice = useAnimatedNumber(totalPrice);
    const animatedVatPrice = useAnimatedNumber(vatPrice);
    const animatedTotalPayment = useAnimatedNumber(totalPayment);

    useEffect(() => {
        setDrawerState(isOpen);
    }, [isOpen]);

    return (
        <>
            {/* Overlay */}
            <div 
                onClick={drawerClose} 
                className={`fixed top-0 left-0 h-full w-full bg-black z-20 transition-opacity duration-300 ${drawerState ? 'opacity-70' : 'opacity-0 pointer-events-none'}`}
            ></div>

            {/* Drawer */}
            <div
                className={`bg-white w-2/3 xl:w-96 h-full dark:bg-[#0f172a] fixed right-0 top-0 z-30 max-h-screen overflow-y-auto transition-transform duration-300 ease-in-out transform ${
                    drawerState ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <DrawerHead drawerClose={drawerClose} totalPrice={totalPrice} />

                {!totalPrice ? (
                    <div className="flex h-full items-center">
                        {orderId ? (
                            <InfoBlock
                                title={"Заказ оформлен!"}
                                description={`Ваш заказ #${orderId} скоро будет передан курьерской доставке.`}
                                imageUrl={"/img/order-success-icon.png"}
                                isBtnBack={true}
                                drawerClose={() => drawerClose(false)}
                            />
                        ) : (
                            <InfoBlock
                                title={'Корзина пустая'}
                                description={'Добавьте хотя бы один товар, чтобы сделать заказ.'}
                                imageUrl={'/img/package-icon.png'}
                                isBtnBack={true}
                                drawerClose={() => drawerClose(false)}
                            />
                        )}
                    </div>
                ) : (
                    <>
                        <div className="m-3 xl:m-5">
                            <CartItemList />
                        </div>

                        <div className="sticky bottom-16 mt-20 xl:mt-0 xl:bottom-0 p-4 border-t border-slate-200 bg-white dark:bg-[#0f172a] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                            <div className="flex gap-2 dark:text-white">
                                <span>Количество товаров:</span>
                                <div className="flex-1 border-b border-dashed"></div>
                                <b>{items.length} шт.</b>
                            </div>

                            <div className="flex gap-2 dark:text-white transition-all duration-500 ease-in-out">
                                <span>Общая цена:</span>
                                <div className="flex-1 border-b border-dashed"></div>
                                <b className="transition-colors duration-500 ease-in-out">{animatedTotalPrice} руб.</b>
                            </div>

                            <div className="flex gap-2 dark:text-white transition-all duration-500 ease-in-out">
                                <span>Налог 5%:</span>
                                <div className="flex-1 border-b border-dashed"></div>
                                <b className="transition-colors duration-500 ease-in-out">{animatedVatPrice} руб.</b>
                            </div>

                            <div className="flex gap-2 dark:text-white transition-all duration-500 ease-in-out">
                                <span>Итого:</span>
                                <div className="flex-1 border-b border-dashed"></div>
                                <b className="transition-colors duration-500 ease-in-out">{animatedTotalPayment} руб.</b>
                            </div>

                            <button
                                className="bg-lime-500 mt-7 w-full rounded-xl py-3 text-white cursor-pointer disabled:bg-slate-300 hover:bg-lime-600 transition active:bg-lime-700"
                                // onClick={() => dispatch(createOrder())}
                            >
                                Оформить заказ
                            </button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default Drawer;