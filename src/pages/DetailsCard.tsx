import { FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetProductByIdQuery, useToggleFavoriteMutation } from '../redux/slices/api/apiProductsSlice';
import { useAppDispatch, useAppSelector } from '../hooks/hooksRedux';
import { selectIsAuth, updateFavorites } from '../redux/slices/authSlice';
import { ArrowLeft, Heart } from 'lucide-react';
import Loader from '../components/UI/Loader/Loader';
import { openDrawer } from '../redux/slices/drawerSlice';
import { addProduct } from '../redux/slices/cartSlice';
import EditDetailsCard from '../components/EditDetailsCard';

const DetailsCard: FC = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const {data: dataUser} = useAppSelector(state => state.auth)
    const isAuth = useAppSelector(selectIsAuth)

    const {data, error, isLoading} = useGetProductByIdQuery(id || '')
    const [toggleFavorite] = useToggleFavoriteMutation()
    
    const productInCart = useAppSelector(state => state.cart.items)
    const findProductInCart = productInCart.find(item => item._id === id) 

    const isFavorite = dataUser?.favorites?.some(fav => fav._id === id);

    const handleToggleFavorite = async () => {
        if (data) {
            const products = {
                _id: id || '',
                title: data.title,
                price: data.price,
                imageUrl: data.imageUrl,
                user: data.user,
                description: data.description,
            };
        
            if (isAuth) {
                try {
                    await toggleFavorite(id || '');
                    dispatch(updateFavorites(products));
                } catch (error) {
                    console.error('Ошибка при обновлении избранного:', error);
                }
            } else {
                navigate('/login');
            }
        }
    };


    return (
        <>
            {error ? (
                <p className='text-red-400 flex justify-center'>
                    Продукт с идентификатором {id} не найден.
                </p>
            ) : isLoading ? (
                <Loader />
            ) : data ? (
                <>
                    <div className="flex items-center gap-5 mb-5 xl:mb-10" >
                        <ArrowLeft onClick={() => navigate(-1)} className="text-slate-400 cursor-pointer transition hover:-translate-x-1 hover:text-black dark:hover:text-slate-500 dark:text-white" size={32} />
                        <h2 className="text-xl xl:text-2xl font-bold dark:text-white">
                            Подробности о товара 
                        </h2>

                        <div className='flex-1'></div>
                        
                        {dataUser?._id === data.user &&
                            <EditDetailsCard product_id={data._id} />
                        }

{/*
                        <SquarePen 
                            className='focus:outline-none text-blue-600 dark:text-blue-400 cursor-pointer transition duration-300 hover:text-blue-400 dark:hover:text-blue-200'
                            size={27}
                            data._id="pen"
                        />
                        <Trash 
                            className='focus:outline-none text-rose-600 dark:text-rose-400 cursor-pointer transition duration-300 hover:text-rose-400 dark:hover:text-rose-200' 
                            size={27}
                            data._id="trashIcon1"

                        /> */}
                    </div>
                    
                    <div className="xl:flex xl:justify-start xl:ml-16 gap-14">

                        <div className='flex justify-end xl:hidden' onClick={handleToggleFavorite}>
                            {isFavorite ? (
                                    <img src='/img/heart-1.svg' className='cursor-pointer max-w-12' alt="Favorite Icon" />
                                ) : (
                                    <Heart className='dark:text-white cursor-pointer' size={25} />
                                )} 
                        </div>

                        <div className='dark:bg-gray-200 flex justify-center rounded-lg xl:p-2 xl:m-0 p-10 mr-10 ml-10 h-full'>
                            <img 
                                className='xl:max-w-[250px]  mix-blend-multiply'
                                src={`http://localhost:5000${data?.imageUrl}`}
                                alt="Product Image"
                            />
                        </div>

                        <div className='ml-[-40px] hidden xl:block' onClick={handleToggleFavorite}>
                            {isFavorite ? (
                                    <img src='/img/heart-1.svg' className='cursor-pointer max-w-12' alt="Favorite Icon" />
                                ) : (
                                    <Heart className='dark:text-white cursor-pointer' size={25} />
                                )} 
                        </div>

                        <div className="xl:w-1/2">
                            <h1 className="text-xl xl:text-2xl mb-3 mt-3 xl:mt-0 dark:text-white">{ data?.title }</h1>
                            <span className="text-base text-slate-400 ">Код товара: { data?._id }000010 </span>
                            
                            <div className="mt-3 border-b pb-3 mb-3" />

                            <h1 className="text-xl xl:text-2xl text-blue-600 dark:text-blue-400 font-bold"> Все характеристики</h1>
                            {data?.description ? (
                             <p className="mt-2 mb-3 xl:mb-0 dark:text-white text-justify" >
                                {data?.description}
                            </p>
                            ) : (
                                <div className='dark:text-white mt-2 mb-3'>
                                    В этом товаре нету характеристики или описание
                                </div>
                            )}

                    </div>

                    <div className="rounded-lg border shadow-[0px_6px_40px_-12px_rgba(0,0,0,0.3)] xl:w-[340px] h-full mb-5 xl:mb-0 p-5">
                        <span className='text-slate-400'>ЦЕНА:</span>
                        <br />
                        <b className="text-2xl dark:text-white">{ data?.price } руб.</b>

                        {findProductInCart ? (
                            <>
                                <button
                                    type="button" 
                                    disabled 
                                    className="bg-gradient-to-br from-[#0093E9] to-[#2cc4b2] mt-7 w-full rounded-xl py-3 text-white cursor-pointer  hover:from-[#1097e6] hover:to-[#209689] transition disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-400 "
                                >
                                    <span>Товар добавлен в корзину</span>
                                </button>
                                <div className='flex justify-center mt-1 ' >
                                    <span 
                                        onClick={() => dispatch(openDrawer())} className='hover:underline decoration-2 hover:decoration-sky-500 cursor-pointer dark:text-white'
                                    >
                                        Перейти в корзину
                                    </span>
                                </div>
                            </>
                        ) : (

                            <button
                                className="bg-gradient-to-br from-[#0093E9] to-[#2cc4b2] mt-7 w-full rounded-xl py-3 text-white cursor-pointer  hover:from-[#1097e6] hover:to-[#209689] transition disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-400 "
                                onClick={() => dispatch(addProduct(data))}
                            >
                                <span>Добавить в корзину</span>
                            </button>
                        )}

                    </div>

                </div>
            </>
            ) : null}
        </>
    );
};

export default DetailsCard;