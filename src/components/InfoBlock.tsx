import { FC } from 'react';
import { useAppDispatch } from '../hooks/hooksRedux';
import { useNavigate } from 'react-router-dom';
import { clickOrderId } from '../redux/slices/cartSlice';

interface InfoBlockProps {
    title: string;
    description: string;
    imageUrl: string;
    isBtnBack: boolean;
    isNavigateHome?: boolean;
    drawerClose?: () => void;
}

const InfoBlock: FC<InfoBlockProps> = (
    {title, description, imageUrl, isBtnBack, drawerClose, isNavigateHome}
) => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const isButtonBack = () => {
        if (isNavigateHome){
            navigate('/')
        } else {
            if (drawerClose) {
                drawerClose()
                dispatch(clickOrderId(''))
            }
        }
    }

    return (
        <div className="flex flex-col items-center text-center p-2 mx-auto">
                <img height="80" width="80" src={imageUrl} alt="info image" />
                <h2 className="mt-4 text-2xl dark:text-white font-medium">{ title }</h2>
                <p className="text-gray-400 mt-2 mb-5">{ description }</p>
                {isBtnBack && 
                    <div className="relative">
                        <img className="absolute left-4 top-4 rotate-180" src="/img/arrow-next.svg" alt="arrow-next" />
        
                        <button
                            className="bg-lime-500 w-64 rounded-xl items-center hover:bg-lime-600 transition py-3 text-white active:bg-lime-700 focus:border-gray-400"
                            onClick={isButtonBack}
                        >
                            Вернуться назад
                        </button>
                    </div>
                }
        </div>
    );
};

export default InfoBlock;