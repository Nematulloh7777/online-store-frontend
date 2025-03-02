import { FC, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/hooksRedux';
import { logOut } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { Settings, LogOut } from 'lucide-react';
import { getAvatar } from '../../utils/avatar';


const MenuUser: FC = () => {
    const [menu, setMenu] = useState(false)
    const menuRef = useRef<HTMLLIElement>(null);

    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const {data} = useAppSelector(state => state.auth)

    const onClickLogOut = () => {
        dispatch(logOut())
        window.localStorage.removeItem('token')
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenu(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [])

    return (
        <li onClick={() => setMenu(!menu)} ref={menuRef} className='grid justify-items-center'>
            <button  className="flex hover:brightness-75 transition-all duration-300 items-center text-sm rounded-full focus:ring-[6px] focus:ring-gray-300 dark:focus:ring-gray-600">
                {data?.avatarUrl ? (
                    <img
                        className="w-10 h-10 outline outline-2 outline-offset-2 outline-slate-400 rounded-full"
                        src={`http://localhost:5000${data?.avatarUrl}`}
                        alt="avatar"
                    />
                ) : (
                    <img src={getAvatar(data?.fullName)} alt="avatar" className='w-10 h-10 outline outline-2 outline-offset-2 outline-slate-400 rounded-full' />
                )}
            </button>

            {menu && (
                <div className="absolute right-2 bottom-20 xl:bottom-auto xl:right-auto z-10 mt-[85px] w-auto bg-white dark:bg-gray-700 rounded-lg shadow-xl border border-slate-200">
                    <div className="px-4 py-3">
                        <span className="block text-sm font-semibold text-gray-900 dark:text-white">{data?.fullName}</span>
                        <span className="block text-sm mt-1 text-gray-500 truncate dark:text-gray-400">{data?.email}</span>
                    </div>
                    <ul className="py-2 cursor-pointer">
                        <li onClick={() => navigate('/settings/profile')} className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                            <Settings className="w-4 h-4 mr-2" />
                            <span>Настройки</span>
                        </li>
                        <li onClick={onClickLogOut} className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                            <LogOut className="w-4 h-4 mr-2" />
                            <span>Выйти</span>
                        </li>
                    </ul>
                </div>
            )}
        </li>
    );
};

export default MenuUser;