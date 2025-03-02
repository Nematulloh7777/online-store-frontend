import { FC, useState } from 'react';
import DOMPurify from 'dompurify';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/hooksRedux';
import { addProduct, removeProduct } from '../redux/slices/cartSlice';

interface CardProps {
    id: string;
    imageUrl?: string;
    title: string;
    price: number;
    text?: string;
    isFavorite?: boolean;
    onToggleFavorite: (items: any) => void;
}

const Card: FC<CardProps> = ({id, imageUrl, title, price, text, isFavorite, onToggleFavorite}) => {
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch()
    
    const items = {_id: id, imageUrl, title, price}

    const isAdded = useAppSelector(state => state.cart.items.some(item => item._id === id));

    const onClickAdd = () => {
        const item = {
            _id: id,
            title,
            price,
            imageUrl,
            user: id,
        }
        if (isAdded) {
            dispatch(removeProduct(item));
        } else {
            dispatch(addProduct(item));
        }
    }

    const highlightText = (text: string, query: string) => {
        if (!query) return text;
        const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${safeQuery})`, 'gi');
        return text.replace(regex, '<span class="bg-yellow-200">$1</span>');
    };

    const createSafeHTML = (htmlString: string) => {
        return { __html: DOMPurify.sanitize(htmlString) };
    };

    return (
        <div 
            className='dark:bg-gray-300 relative bg-white cursor-pointer border rounded-3xl shadow-sm p-8 border-slate-200 transition hover:-translate-y-2 hover:shadow-xl'
        >
            <img 
                src={isFavorite ? '/img/like-2.svg' : '/img/like-1.svg'} 
                alt="favorite"
                onClick={() => onToggleFavorite(items)}
                className='absolute top-8 border border-slate-200 rounded-lg left-8 z-[5] hover:opacity-80 hover:scale-110 transition transform duration-200 ease-in-out cursor-pointer'
            />

            {/* <div className='flex items-center justify-center'
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => navigate(`/details-product/${id}`)}
            >
                <img 
                    className='mix-blend-multiply rounded-md w-[130px] md:w-[155px] xl:w-[180px]' 
                    src={`http://localhost:5000${imageUrl}`}
                    alt="изображения товара"
                 />
            </div> */}

            <div
                className='flex items-center justify-center m-auto mix-blend-multiply
                rounded-md w-[130px] md:w-[155px] h-[190px] xl:w-[202px] xl:h-[269px] overflow-hidden'
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => navigate(`/details-product/${id}`)}
            >
                <img 
                    className='w-full h-full object-contain object-center' 
                    src={`http://localhost:5000${imageUrl}`}
                    alt="в этом товаре нету изображения"
                />
            </div>

            <p 
                onClick={() => navigate(`/details-product/${id}`)}
                className={`text-sm line-clamp-2 text-black xl:text-base ${isHovered ? 'text-[#0093E9] transition-all' : 'hover:text-[#0093E9]'}`}
            >
                {text
                    ? <span dangerouslySetInnerHTML={createSafeHTML(highlightText(title, text))} />
                    : <span>{title}</span>
                } 
            </p>

            <div className='flex justify-between mt-5'>
                <div className='flex flex-col'>
                    <span className='text-slate-400'>ЦЕНА:</span>
                    <b className='text-black'>{price} руб.</b>
                </div>

                <div>
                    <img
                        onClick={onClickAdd} 
                        src={isAdded ? '/img/checked.svg' : '/img/plus.svg'} 
                        alt="plus"
                        className="border border-slate-200 rounded-lg hover:opacity-80 hover:scale-110 transition transform duration-200 ease-in-out cursor-pointer"
                    />
                </div>

            </div>
        </div>
    );
};

export default Card;