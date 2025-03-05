import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/hooksRedux';
import { fetchRegister, IUser, selectIsAuth } from '../redux/slices/authSlice';

interface RegisterFormInputs {
    email: string;
    password: string;
    fullName: string;
}

const Register: FC = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const isAuth = useAppSelector(selectIsAuth)
    const error = useAppSelector(state => state.auth.error)
    const [showPassword, setShowPassword] = React.useState(false)

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev)
    }

    const { 
        register,
        handleSubmit,
        setError,
        formState: { errors, },
    } = useForm<RegisterFormInputs>({
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
        },
        mode: 'all',
    })

    const fullNameError = errors['fullName']?.message
    const emailError = errors['email']?.message
    const passwordError = errors['password']?.message

    const isUser = (payload: any): payload is IUser => {
        return payload && typeof payload.token === 'string';
    };

    const onSubmit: SubmitHandler<RegisterFormInputs> = async (values) => {
        const data = await dispatch(fetchRegister(values))
        if (!data.payload) return
        
        if (isUser(data.payload)) {
            window.localStorage.setItem('token', data.payload.token)
        }
    }

    React.useEffect(() => {
        if (isAuth) {
            navigate('/');
        }
    }, [isAuth, navigate]);

    React.useEffect(() => {
        if (Array.isArray(error)) {
            error.forEach(({ path, msg }) => {
                setError(path, { type: 'server', message: msg });
            });
        }
    }, [error, setError])

    return (
        <div className="flex flex-col items-center justify-center px-2 mx-auto md:w-1/3 xl:w-1/3" >
            <div className="w-full bg-white rounded-lg border border-slate-200 shadow-xl dark:border xl:p-0 dark:bg-[#0f172a] dark:border-gray-700">
                <div className="p-6 space-y-4">
                    <h1 className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-[#0093E9] to-[#2cc4b2] dark:text-white font-bold xl:text-2xl text-center">
                        Регистрация
                    </h1>

                    {error && typeof error === "object" && "message" in error && (
                        <p className='text-rose-500 text-center mt-0 pt-0'>{error.message}</p>
                    )}

                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <input
                                type="text"
                                className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                                    fullNameError ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500' : 'border-gray-300 dark:border-gray-600'} `} 
                                placeholder="Полное имя"
                                {...register('fullName', { required: 'Укажите полное имя' })}
                            />
                            {fullNameError && <p className='text-rose-500 mt-0 pt-0 text-sm' >{fullNameError}</p>}
                        </div>

                        <div>
                            <input 
                                type="email" 
                                className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                                    emailError ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500' : 'border-gray-300 dark:border-gray-600'} `}
                                placeholder="Ваш E-Mail"
                                {...register('email', { 
                                    required: 'Укажите почту',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                        message: "Некорректный email адрес",
                                    }
                                })}
                            />
                            {emailError && <p className='text-rose-500 mt-0 pt-0 text-sm' >{emailError}</p>}
                        </div>

                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Ваш Пароль"
                                className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                                    passwordError ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500' : 'border-gray-300 dark:border-gray-600'
                                }`}
                                {...register('password', { required: 'Укажите пароль' })}
                            />
                            <div
                                className="absolute inset-y-0 right-2 flex items-center cursor-pointer"
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? (
                                    <Eye className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                ) : (
                                    <EyeOff className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                )}
                            </div>
                        </div>
                        <span>
                            {passwordError && <p className="text-rose-500 mt-1 text-sm">{passwordError}</p>}
                        </span>

                        {/* <input type="password" placeholder="Подтвердите пароль" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required /> */}

                        <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                            Зарегистрироваться
                        </button>
                        
                        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                            У вас уже есть аккаунт? <span onClick={() => navigate('/login')} className="font-medium text-primary-600 cursor-pointer hover:underline dark:text-primary-500">Войти здесь</span>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;