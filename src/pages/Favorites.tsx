import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/hooksRedux';
import InfoBlock from '../components/InfoBlock';
import { ArrowLeft } from 'lucide-react';
import CardList from '../components/CardList';

const Favorites: FC = () => {
    const navigate = useNavigate()

    const {data: dataUser} = useAppSelector(state => state.auth)

    const favorites = dataUser?.favorites || []

    return (
        <div className="dark:text-white flex h-full items-center mb-16 xl:mb-0">
            {!favorites.length ? (
                <InfoBlock
                    title="Закладок нет :("
                    description="Вы ничего не добавили в закладки"
                    imageUrl="/img/emoji-1.png"
                    isBtnBack
                    isNavigateHome
                />
            ) : (
                <div>
                    <div className="flex items-center gap-5 mb-8">
                        <ArrowLeft
                            size={28}
                            onClick={() => navigate('/')}
                            className="opacity-30 cursor-pointer transition dark:opacity-70 dark:hover:opacity-100 dark:text-white hover:-translate-x-1 hover:opacity-100"
                        />
                        <h2 className="text-2xl font-bold">Мои Закладки</h2>
                    </div>

                    <div className="mt-10">
                        <CardList items={favorites} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Favorites;