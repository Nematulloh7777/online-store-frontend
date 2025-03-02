import React, { ChangeEvent, FC, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/hooksRedux';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import apiClient from '../axios';
import { selectIsAuth, updateUserAsync } from '../redux/slices/authSlice';
import { getAvatar } from '../utils/avatar';

const ProfileUser: FC = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const { data, error } = useAppSelector(state => state.auth)
    const isAuth = useAppSelector(selectIsAuth)

    const [showPassword, setShowPassword] = React.useState(false)
    const [imageUrl, setImageUrl] = React.useState(data?.avatarUrl || '')

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev)
    }

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isValid },
        getValues,
        watch,
    } = useForm({
        defaultValues: {
            fullName: data?.fullName || '',
            email: data?.email || '',
            password: '',
        },
        mode: 'onChange',
    });

    const watchedValues = watch();
    const isChanged =
        watchedValues.fullName !== data?.fullName ||
        watchedValues.email !== data?.email ||
        watchedValues.password ||
        imageUrl !== data?.avatarUrl

    const fullNameError = errors['fullName']?.message
    const emailError = errors['email']?.message
    const passwordError = errors['password']?.message

    const onSubmit = (values) => {
        const updates = {}
        const currentValues = getValues()

        if (currentValues.fullName !== data?.fullName) {
            updates.fullName = currentValues.fullName
        }
        if (currentValues.email !== data?.email) {
            updates.email = currentValues.email
        }
        if (currentValues.password) {
            updates.password = currentValues.password
        }
        if (data?._id) {
            const fields = {_id: data._id, ...updates, avatarUrl: imageUrl}
            dispatch(updateUserAsync(fields))
        }
    };

    React.useEffect(() => {
        if (Array.isArray(error)) {
            error.forEach(({ path, msg }) => {
                setError(path, { type: 'server', message: msg })
            });
        }
    }, [error, setError])

    React.useEffect(() => {
        if (!isAuth) {
            navigate('/')
        }
    }, [isAuth, navigate])

    const inputFileRef = useRef<HTMLInputElement>(null)

    const handleChangeFile = async (
        event: ChangeEvent<HTMLInputElement>, 
        category = 'user_img'
    ) => {
        try {
            const files = event.target.files

            if (!files || files.length === 0) {
                console.warn('Файл не выбран')
                return
            }

            const formData = new FormData()
            const file = files[0]
            formData.append('image', file)
            formData.append('category', category)

            const { data } = await apiClient.post('/api/upload', formData)
            setImageUrl(data.url)
        } catch (err) {
            console.warn(err)
        }
    }

    const onClickRemoveImage = async () => {
        const filename = imageUrl.split('/').pop()
        await apiClient.delete(`/api/upload/user_img/${filename}`)
        setImageUrl('')
    }

    return (
        <div className="dark:text-white">
            <div className="flex items-center gap-5 mb-4">
                <ArrowLeft
                    size={28}
                    onClick={() => navigate(-1)}
                    className="opacity-30 cursor-pointer transition dark:opacity-70 dark:hover:opacity-100 dark:text-white hover:-translate-x-1 hover:opacity-100"
                />
                <h2 className="text-2xl font-bold">Мои настройки</h2>
            </div>

            <div className="flex justify-start ml-[50px] gap-10">
                <div className="w-[300px] hidden xl:block">
                    <span className="font-medium">Профиль</span>
                    <p className="text-sm opacity-65 mt-1">
                        Ваши персональные данные и настройки безопасности учетной записи.
                    </p>
                </div>

                <div className="w-2/3 xl:w-[30%]">
                    <span className="font-medium flex mb-2">Аватар</span>

                    {imageUrl ? (
                        <img
                            className="hover:brightness-[0.8] z-10 mt-1 mb-1 hover:shadow-slate-400 cursor-pointer transition duration-300 w-[80px] h-[80px] rounded-full"
                            src={`http://localhost:5000${imageUrl}`}
                            alt="avatar"
                        />
                    ) : (
                        <img
                            className="hover:brightness-[0.8] z-0 mt-1 mb-1 hover:shadow-slate-400 cursor-pointer transition duration-300 w-[80px] h-[80px] rounded-full"
                            src={getAvatar(data?.fullName)}
                            alt="avatar"
                        />
                    )}

                    <button
                     onClick={() => inputFileRef.current?.click()} type="button" className="text-cyan-500 mt-3 hover:text-white border border-cyan-600 hover:bg-cyan-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-300 me-2 mb-2 dark:border-cyan-400 dark:text-cyan-400 dark:hover:text-white dark:hover:bg-cyan-700">
                        Загрузить аватарку
                    </button>

                    <input 
                        ref={inputFileRef} 
                        type="file" 
                        onChange={handleChangeFile} 
                        hidden 
                    />

                    {imageUrl && (
                        <button type="button" onClick={onClickRemoveImage} className="text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700">
                        Удалить
                        </button>
                    )}

                    <span className="flex font-medium">{data?.fullName}</span>

                    <form className="space-y-4 mt-4" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label
                                htmlFor="text"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Полное имя
                            </label>
                            <input
                                type="text"
                                className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                                    fullNameError
                                        ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500'
                                        : 'border-gray-300 dark:border-gray-600'
                                }`}
                                placeholder="Полное имя"
                                {...register('fullName')}
                            />
                            {fullNameError && (
                                <p className="text-rose-500 mt-0 pt-0 text-sm">{fullNameError}</p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                                    emailError
                                        ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500'
                                        : 'border-gray-300 dark:border-gray-600'
                                }`}
                                placeholder="Ваш E-Mail"
                                {...register('email', {
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                        message: 'Некорректный email адрес',
                                    },
                                })}
                            />
                            {emailError && (
                                <p className="text-rose-500 mt-0 pt-0 text-sm">{emailError}</p>
                            )}
                        </div>

                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Пароль
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Введите новый пароль"
                                className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                                    passwordError
                                        ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500'
                                        : 'border-gray-300 dark:border-gray-600'
                                }`}
                                {...register('password')}
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
                        {passwordError && (
                            <p className="text-rose-500 mt-1 text-sm">{passwordError}</p>
                        )}

                        <button
                            type="submit"
                            disabled={!isChanged}
                            className={`w-full text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
                                isChanged
                                    ? 'bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
                                    : 'bg-slate-400 cursor-not-allowed'
                            }`}
                        >
                            Сохранить
                        </button>
                    </form>

                </div>
            </div>
        </div>
    );
};

export default ProfileUser;