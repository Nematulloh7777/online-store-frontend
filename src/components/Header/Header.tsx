import { FC, useEffect, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import Theme from '../UI/Theme/Theme';
import { useAppSelector } from '../../hooks/hooksRedux';
import { selectIsAuth } from '../../redux/slices/authSlice';
import MenuUser from './MenuUser';
import { Plus } from 'lucide-react';

interface HeaderProps {
    drawerOpen: () => void
}

const Header: FC<HeaderProps> = ({drawerOpen}) => {
    const [isSticky, setIsSticky] = useState(false)
    const navigate = useNavigate()
    const {items, totalPrice} = useAppSelector(state => state.cart)
    // const [isMobileModalOpen, setIsMobileModalOpen] = useState(false)

    const isAuth = useAppSelector(selectIsAuth)

    const {data} =  useAppSelector(state => state.auth)
    const favorites = data?.favorites || []

    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 0)
        }

        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    return (
        <header className={`flex justify-between rounded-t-[25px] border-b shadow-md border-slate-300 px-5 xl:px-10 py-4 xl:py-8 dark:bg-[#0f172a] ${isSticky ? 'fixed top-0 left-0 right-0 z-10 backdrop-blur-2xl bg-white/50 dark:bg-[#0f172a]/80 dark:backdrop-blur-2xl xl:w-[85%] xl:m-auto rounded-b-[25px] shadow-lg' : ''} `}>

            <div onClick={() => navigate('/')} className='flex items-center m-auto gap-3 cursor-pointer hover:text-slate-500 hover:scale-95 transition-all duration-200 '>
                <img src="/img/logo.png" alt="logo" className='w-7 xl:w-10' />
                <div>
                    <h1 className='text-sm xl:text-xl font-bold uppercase bg-clip-text text-transparent bg-gradient-to-r from-[#0093E9] to-[#2cc4b2] dark:text-white'>React | Online Store</h1>
                    <p className='text-xs xl:text-base text-slate-400'>Магазин лучших товаров</p>
                </div>
            </div>

            <div className="flex xl:flex-1"></div>

            <ul className='hidden xl:flex items-center gap-5'>
               <li>
                    {isAuth &&
                        <NavLink
                            to="/create-product"
                        >
                            <button className="flex justify-center items-center gap-1 text-gray-900 bg-gray-100 border border-gray-300 hover:bg-gray-200 font-medium rounded-full transition duration-300 text-sm px-3 py-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 ">
                                <Plus strokeWidth={1.5} />
                                Создать
                            </button>
                        </NavLink>
                    }
                </li>
                <li className='grid justify-items-center cursor-pointer gap-1 text-slate-500 hover:text-black transition-all duration-200 dark:text-slate-300  dark:hover:text-slate-400' >
                    <img src="/img/location.svg" alt="location" className='icon'/>
                    <span>Москва</span>
                </li>
                <li onClick={drawerOpen} className='relative grid justify-items-center cursor-pointer gap-1 text-slate-500 hover:text-black transition-all duration-200 dark:text-slate-300 dark:hover:text-slate-400'>
                    <img src="/img/cart.svg" alt="cart" className='icon' />
                    <b className='mt-[1px]'>{totalPrice} руб.</b>
                    {items.length > 0 &&
                        <span className="absolute -top-3 right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                            {items.length}
                        </span>
                    }
                </li>
                <NavLink
                    to="/favorites"
                    className={({ isActive, isPending }) =>
                        isPending ? "" : isActive ? "text-black font-medium" : "text-slate-500  hover:text-black"
                    }
                    >
                        <li
                            className={`relative grid justify-items-center cursor-pointer gap-1 transition-all duration-200 dark:text-slate-300 dark:hover:text-slate-400`}
                        >
                            <img src="/img/heart.svg" alt="favourite" className='icon' />
                            <span>Закладки</span>
                            {favorites.length > 0 &&
                                <span className="absolute -top-3 right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {favorites.length}
                                </span>
                            }
                        </li>
                </NavLink>

                {isAuth ? (
                    <MenuUser />
                ) : (
                    <NavLink
                        to="/login"
                        className={({ isActive, isPending }) =>
                            isPending ? "" : isActive ? "text-black font-medium" : "text-slate-500  hover:text-black"
                        }
                    >
                        <li className='grid justify-items-center gap-1 cursor-pointer transition-all duration-200 dark:text-slate-300 dark:hover:text-slate-400'>
                            <img src="/img/profile.svg" alt="profile" className='icon' />
                            <span>Профиль</span>
                        </li>
                    </NavLink>
                )}
            </ul>

            <ul className='flex xl:hidden items-center'>
                <li className='grid justify-items-center cursor-pointer text-slate-500 hover:text-black transition-all duration-200 dark:text-slate-300  dark:hover:text-slate-400' >
                    <img src="/img/location.svg" alt="location" className='icon'/>
                </li>
            </ul>

            <div className='ml-5'>
               <Theme />
            </div>

        </header>
    );
};

export default Header