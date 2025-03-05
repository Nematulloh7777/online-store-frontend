import { FC } from 'react';
import { House, ShoppingCart, User, Heart, CirclePlus } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAppSelector } from '../../hooks/hooksRedux';
import MenuUser from '../Header/MenuUser';
import { selectIsAuth } from '../../redux/slices/authSlice';

interface MobileHeadeProps {
    toggleDrawer: () => void
}

const MobileHeader: FC<MobileHeadeProps> = ({toggleDrawer}) => {
    const {items} = useAppSelector(state => state.cart)
    const {data} = useAppSelector(state => state.auth)
    const isAuth = useAppSelector(selectIsAuth)
    
    return (
        <div className='fixed bottom-0 w-full p-4 border-t border-slate-200 z-30 bg-white dark:bg-[#0f172a] text-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] xl:hidden'>
            <div className='flex justify-around items-center h-10'>
                <NavLink
                    to="/"
                    className={({ isActive, isPending }) =>
                        isPending ? "" : isActive ? "text-sky-500" : "text-slate-500 hover:text-slate-600"
                    }
                >
                    <button className='flex flex-col items-center'>
                        <House className='w-6 h-6' />
                        <span className='text-xs mt-2 '>Главная</span>
                    </button>
                </NavLink>

                {/* <NavLink
                    to="/catalog"
                    className={({ isActive, isPending }) =>
                        isPending ? "" : isActive ? "text-sky-500" : "text-slate-500 hover:text-slate-600"
                    }
                >
                    <button className='flex flex-col items-center'>
                        <TextSearch className='w-6 h-6' />
                        <span className='text-xs mt-2'>Каталог</span>
                    </button>
                </NavLink> */}

                <button onClick={toggleDrawer} className='flex flex-col items-center relative'>

                    <ShoppingCart className='w-6 h-6 text-slate-500' />
                    {items.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                            {items.length}
                        </span>
                    )}
                    <span className='text-xs mt-2 text-slate-500'>Корзина</span>
                </button>

                {/* <NavLink
                    className={({ isActive, isPending }) =>
                        isPending ? "" : isActive ? "text-sky-500" : "text-slate-500 hover:text-slate-600"
                    }
                >
                    <button onClick={() => dispatch(openDrawer())} className='flex flex-col items-center'>
                        <ShoppingCart className='w-6 h-6' />
                        <span className='text-xs mt-2'>Корзина</span>
                    </button>
                </NavLink> */}

                <NavLink
                    to="/create-product"
                    className={({ isActive, isPending }) =>
                        isPending ? "" : isActive ? "text-sky-500" : "text-slate-500 hover:text-slate-600"
                    }
                >
                    <button className='flex flex-col items-center'>
                        <CirclePlus className='w-6 h-6' />
                        <span className='text-xs mt-2'>Создать</span>
                    </button>
                </NavLink>

                <NavLink
                    to="/favorites"
                    className={({ isActive, isPending }) =>
                        isPending ? "" : isActive ? "text-sky-500" : "text-slate-500 hover:text-slate-600"
                    }
                >

                    <button className='flex flex-col items-center relative'>
                        <Heart className='w-6 h-6' />
                        {(data?.favorites?.length ?? 0) > 0 && (
                            <span className="absolute -top-2 -right-1.5 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                {data?.favorites.length}
                            </span>
                        )}
                        <span className='text-xs mt-2'>Закладки</span>
                    </button>
                </NavLink>

                {isAuth ? (
                    <MenuUser />
                ) : (
                    <NavLink
                        to="/login"
                        className={({ isActive, isPending }) =>
                            isPending ? "" : isActive ? "text-sky-500" : "text-slate-500 hover:text-slate-600"
                        }
                    >
                        <button className='flex flex-col items-center'>
                            <User className='w-6 h-6' />
                            <span className='text-xs mt-2'>Профиль</span>
                        </button>
                    </NavLink>
                )}

            </div>
        </div>
    );
};

export default MobileHeader;