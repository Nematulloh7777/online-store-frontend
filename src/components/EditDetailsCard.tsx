import { SquarePen, Trash } from 'lucide-react';
import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetchDeleteProductMutation } from '../redux/slices/api/apiProductsSlice';

interface EditDetailsCardProps {
    product_id: string
}

const EditDetailsCard: FC<EditDetailsCardProps> = ({product_id}) => {
    const navigate = useNavigate()
    const [fetchDeleteProduct] = useFetchDeleteProductMutation()
    const [isModalOpen, setIsModalOpen] =useState(false);

    async function deleteProduct() {
        await fetchDeleteProduct(product_id)
        setIsModalOpen(false);
        navigate('/')
    }

    return (
        <div className='flex gap-5'>
            <SquarePen
                className='focus:outline-none text-blue-600 dark:text-blue-400 cursor-pointer transition duration-300 hover:text-blue-400 dark:hover:text-blue-200'
                size={27}
                onClick={() => navigate(`/edit-product/${product_id}`)}
            />
            <Trash
                className='focus:outline-none text-rose-600 dark:text-rose-400 cursor-pointer transition duration-300 hover:text-rose-400 dark:hover:text-rose-200' 
                size={27}
                onClick={() => setIsModalOpen(true)}
            />
            
            {isModalOpen && (
                <div className="fixed z-40 inset-0 flex p-10 items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center transform transition-all duration-300 scale-95 opacity-0 animate-fade-in">
                        <p className="text-lg font-medium text-gray-900 dark:text-white">
                            Вы действительно хотите удалить этот продукт?
                        </p>
                        <div className="mt-4 flex justify-center gap-4">
                            <button
                                className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded transition"
                                onClick={deleteProduct}
                            >
                                Да
                            </button>
                            <button
                                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded transition"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Нет
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default EditDetailsCard;