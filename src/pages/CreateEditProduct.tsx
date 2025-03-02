import React, { ChangeEvent, FC, useEffect, useRef } from 'react';
import { useAppSelector } from '../hooks/hooksRedux';
import { selectIsAuth } from '../redux/slices/authSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import apiClient from '../axios';
import { useFetchCreateProductMutation, useFetchUpdateProductMutation, useGetProductByIdQuery } from '../redux/slices/api/apiProductsSlice';
import Loader from '../components/UI/Loader/Loader';
import { IProduct } from '../types/product';

const CreateEditProduct: FC = () => {
    const {id} = useParams()
    const isEditing = Boolean(id)

    const { data: productData, error: errorData, isLoading: isFetching } = useGetProductByIdQuery(
        id || '', { skip: !isEditing }
    )
    
    const [productId, setProductId] = React.useState<string | null>(null)
    const [imageUrl, setImageUrl] = React.useState('')
    const [title, setTitle] = React.useState('')
    const [description, setDescription] = React.useState('')
    const [price, setPrice] = React.useState('0')

    const [error, setError] = React.useState('')

    const [isSaving, setIsSaving] = React.useState(false);
    const [fetchCreateProduct] = useFetchCreateProductMutation()
    const [fetchUpdateProduct] = useFetchUpdateProductMutation()

    const isAuth = useAppSelector(selectIsAuth)
    const navigate = useNavigate()

    useEffect(() => {
        if (isEditing && productData) {
            setTitle(productData.title)
            setDescription(productData.description || '')
            setPrice(String(productData.price))
            setImageUrl(productData.imageUrl || '')
        }
    }, [productData, isEditing])

    const onSubmit = async () => {
        try {
            setIsSaving(true)
            setError('')
            const fields = {title, description, price: Number(price), imageUrl}

            // const {data} = await apiClient.post('/api/items', fields)
            // const {data} = await fetchCreateProduct(fields)
            if (isEditing) {
                await fetchUpdateProduct({ id, ...fields }).unwrap();
            } else {
                const res = await fetchCreateProduct(fields).unwrap();
                setProductId(res._id)
            }

        } catch (err: any) {
            console.warn(err)
            setError(err.response?.data?.errors?.[0]?.msg || 'Ошибка при создании продукта')
        } finally {
            setIsSaving(false)
        }
    }

    const inputFileRef = useRef<HTMLInputElement>(null)

    const handleChangeFile = async (
        event: ChangeEvent<HTMLInputElement>, 
        category = 'products_img'
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
        await apiClient.delete(`/api/upload/products_img/${filename}`)
        setImageUrl('')
    }

    React.useEffect(() => {
        if (!window.localStorage.getItem('token') && !isAuth) {
            navigate('/')
        }
    }, [isAuth, navigate])
    
    return (
        <div className=" dark:text-white">
            <div className="flex items-center gap-5 mb-4">
                <ArrowLeft
                    size={28}
                    onClick={() => navigate(-1)}
                    className="opacity-30 cursor-pointer transition dark:opacity-70 dark:hover:opacity-100 dark:text-white hover:-translate-x-1 hover:opacity-100"
                />
                <h2 className="text-2xl font-bold">
                    {isEditing ? 'Редактирование продукта' : 'Создание продукта'}
                </h2>
            </div>

            {isFetching ? (
                <Loader />
            ) : (
                <div className='xl:w-[20%] w-[60%] justify-center items-center m-auto'>
                    {error && <p className="text-rose-500 mb-2 text-md">{error}</p>}
                    {errorData && <p className="text-rose-500 mb-2 text-md">
                        Ошибка Продукт не найден
                    </p>}

                    <span className="font-medium flex mb-2">Изображения продукта</span>
                    {imageUrl && (
                        <img
                            className="mt-2 mb-1 w-[180px] "
                            src={`http://localhost:5000${imageUrl}`}
                            alt="Изображения товара"
                        />
                    )}
                    <button
                        onClick={() => inputFileRef.current?.click()} 
                        type="button" 
                        className="text-cyan-500 mt-3 w-full hover:text-white border border-cyan-600 hover:bg-cyan-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-300 me-2 mb-2 dark:border-cyan-400 dark:text-cyan-400 dark:hover:text-white dark:hover:bg-cyan-700"
                    >
                        Загрузить изображения
                    </button>

                    <input 
                        ref={inputFileRef}
                        type="file"
                        onChange={handleChangeFile}
                        hidden
                    />

                    {imageUrl && (
                        <button onClick={onClickRemoveImage} type="button" className="text-white bg-red-700 hover:bg-red-800 w-full font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700">
                            Удалить изображения
                        </button>
                    )}

                    <label
                        htmlFor="text"
                        className="block mb-2 mt-5 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Названия продукта
                    </label>
                    <textarea
                        rows={3}
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className={`bg-gray-50 border resize-none text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white`}
                    />

                    <label
                        htmlFor="text"
                        className="block mb-2 mt-5 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Описание продукта
                    </label>
                    <textarea
                        rows={4}
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className={`bg-gray-50 border resize-none text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white`}
                    />
        
                    <label
                        htmlFor="text"
                        className="block mb-2 mt-5 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Цена продукта
                    </label>
                    <input
                        type="number"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        className={`bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full 
                            p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white `}
                    />

                    <button
                        onClick={onSubmit}
                        disabled={isSaving}
                        className={`w-full mt-5 text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
                            isSaving
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
                        }`}
                    >
                        {isSaving ? 'Сохранение...' : isEditing ? 'Обновить' : 'Добавить'}
                    </button>
                    
                    {productId &&
                        <div className='mt-2 grid text-center'>
                            <span
                                onClick={() => navigate(`/details-product/${productId}`)}
                                className='mb-2 hover:underline decoration-2 hover:decoration-sky-500 cursor-pointer dark:text-white'
                            >
                                Перейти на страницу товара
                            </span>

                            <span
                                onClick={() => navigate('/')}
                                className='mb-2 hover:underline decoration-2 hover:decoration-sky-500 cursor-pointer dark:text-white' 
                            >
                                Перейти на главную страницу
                            </span>
                        </div>
                    }
                </div>
            )}
        </div>
    );
};

export default CreateEditProduct;