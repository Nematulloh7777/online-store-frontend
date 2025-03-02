import { FC } from 'react';
import { IProduct } from '../types/product';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import Error from './Error';
import Card from './Card';
import { useAppDispatch, useAppSelector } from '../hooks/hooksRedux';
import { selectIsAuth, updateFavorites } from '../redux/slices/authSlice';
import { useToggleFavoriteMutation } from '../redux/slices/api/apiProductsSlice';
import { useNavigate } from 'react-router-dom';

interface CardListProps {
    items: IProduct[];
    isLoading?: boolean;
    error?: boolean;
    text?: string;
    errorText?: string;
}

const CardList: FC<CardListProps> = ({items, isLoading, text, error, errorText}) => {

    const [listRef] = useAutoAnimate();
    const skeletonArray = new Array(8).fill(0);
    const navigate = useNavigate()

    const dispatch = useAppDispatch()
    const [toggleFavorite] = useToggleFavoriteMutation()
    const {data} = useAppSelector(state => state.auth)
    const isAuth = useAppSelector(selectIsAuth)

    const handleToggleFavorite = async (item: IProduct) => {
        if (isAuth) {
            try {
                await toggleFavorite(item._id)
                dispatch(updateFavorites(item))
            } catch (error) {
                console.error('Ошибка при обновлении избранного:', error);
            }
        } else {
            navigate('/login')
        }
    };

    return (
        <div className='grid grid-cols-2 xl:grid-cols-4 md:grid-cols-3 gap-4'  >
            {error ? (
                <Error errorText={errorText} />
            ) : isLoading ? (
                skeletonArray.map((_, index) => (
                    <div key={index} className="animate-pulse border rounded-3xl p-8 border-slate-200">
                        <div className="bg-gray-300 h-40 mb-4 rounded-xl"></div>
                        <div className="bg-gray-300 h-4 mb-2 rounded-xl"></div>
                        <div className="bg-gray-300 h-4 w-2/3 mb-2 rounded-xl"></div>
                        <div className='flex justify-between'>
                            <div className="bg-gray-300 h-6 w-1/2 mt-4 rounded-xl flex flex-col"></div>
                            <div className="bg-gray-300 h-8 w-8 mt-3 rounded-md"></div>
                        </div>
                    </div>
                ))
            ) : (
                <div ref={listRef} className="contents">
                    {items.length > 0 ? (
                        items.map(item => {
                            const isFavorite = data?.favorites?.some(fav => fav._id === item._id);
                            return (
                                <Card
                                    key={item._id}
                                    id={item._id} 
                                    imageUrl={item.imageUrl}
                                    title={item.title}
                                    price={item.price}
                                    text={text}
                                    isFavorite={isFavorite}
                                    onToggleFavorite={handleToggleFavorite}
                                />
                            )
                        })
                    ) : (
                        <div className="col-span-4 flex flex-col items-center">
                            <span className='text-2xl font-bold dark:text-white'>Ничего не нашлось по запросу "{text}"</span>
                            <span className='text-slate-400'>Попробуйте поискать по-другому или сократить запрос</span>
                        </div>
                    )}
                </div>
            )}
        </div>

    );
};

export default CardList;