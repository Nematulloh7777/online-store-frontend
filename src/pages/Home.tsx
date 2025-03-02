import React, { FC, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/hooksRedux";
import { setSort } from "../redux/slices/filterSlice";
import { LoaderCircle, X } from "lucide-react";
import CardList from "../components/CardList";
import { useFetchProductsQuery } from "../redux/slices/api/apiProductsSlice";
import debounce from "lodash.debounce";
import { IProduct } from "../types/product";
import InfiniteScroll from "react-infinite-scroll-component";

const Home: FC = () => {
    const [searchIcon, setSearchIcon] = useState("/img/search.svg");
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [page, setPage] = useState(1)

    const dispatch = useAppDispatch()
    const sortBy = useAppSelector(state => state.filter.sort)

    const { data: items, isLoading, isError, error } = useFetchProductsQuery({
        title: debouncedQuery ? `*${debouncedQuery}*` : undefined,
        limit: 8,
        page,
        sortBy
    })
    // console.log(items);
    const [product, setProduct] = useState<IProduct[]>(items || [])
    const [hasMore, setHasMore] = useState(true)

    useEffect(() => {
        if (items?.items) {
            setProduct((prev) => {
                return page === 1 ? items.items : [...prev, ...items.items];
            });
            setHasMore(items.meta.total_pages > items.meta.current_page)
        }
    }, [items]);

    useEffect(() => {
        setPage(1);
        setHasMore(true);
    }, [debouncedQuery, sortBy]);


    // useEffect(() => {
    //     console.log(product)
    //     if (page > 1) {
    //         refetch();
    //     }
    // }, [page]);

    // useEffect(() => {
    //     setPage(1);
    //     setHasMore(true);
    // }, []);
    
    async function fetchMoreProducts() {
        if (!hasMore) return;
        setTimeout(() => {
            if (hasMore) {
                setPage((prev) => prev + 1);
            }
            
        }, 400)
    }
    

    const inputRef = useRef<HTMLInputElement>(null)

    const clearInput = () => {
        setSearchQuery('')
        setDebouncedQuery('')
        inputRef.current?.focus()
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        setSearchIcon(value.length > 0 ? "/img/search3.png" : "/img/search.svg");
    };

    useEffect(() => {
        const handler = debounce(() => {
            setDebouncedQuery(searchQuery)
        }, 300);

        handler();
        return () => handler.cancel();
    }, [searchQuery]);

    const onChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(setSort(e.target.value))
    };

    return (
        <div className='dark:bg-[#0f172a]'>
            <div className='xl:flex xl:justify-between xl:items-center'>
                <h2 className='text-3xl font-bold hidden xl:flex dark:text-white'>Все товары</h2>

                <div className='flex xl:flex-row flex-col gap-4'>
                    <select
                        value={sortBy}
                        onChange={onChangeSelect}
                        className="dark:bg-[#0f172a] w-[220px] order-2 xl:order-1 cursor-pointer dark:text-white py-2 px-3 border focus:border-gray-400 rounded-md outline-none"
                    >
                        <option value="title" className='dark:text-white'>По названию</option>
                        <option value="price" className='dark:text-white'>По цене (дешевые)</option>
                        <option value="-price" className='dark:text-white'>По цене (дорогие)</option>
                        <option value="createdAt" className='dark:text-white'>По созданию</option>
                    </select>

                    <div className='relative order-1'>
                        <img src={searchIcon} alt="search" className='absolute top-3 left-4' />
                        <input 
                            ref={inputRef}
                            value={searchQuery}
                            onChange={handleInputChange}
                            placeholder='Поиск...'
                            className="border rounded-md  outline-none w-full xl:w-auto py-2 pl-11 pr-8 focus:border-gray-400 dark:bg-[#0f172a] dark:text-white"
                        /> 
                        {searchQuery && (
                            <X 
                                className='dark:text-white transition-all duration-300 text-slate-400 cursor-pointer absolute top-2 right-2 hover:text-black dark:hover:text-slate-400 ' 
                                onClick={clearInput}
                            />
                        )}
                    </div>
                    <h2 className='text-2xl font-bold order-3 xl:hidden dark:text-white'>Все товары</h2>
                </div>
            </div>

            {/* <div className='mt-10' > */}
                
                {/* <CardList 
                    items={items?.items || []}
                    isLoading={isLoading}
                    error={isError}
                    errorText={error?.message}
                    text={debouncedQuery}
                /> */}
            {/* </div> */}

            <InfiniteScroll
                className="mt-10"
                dataLength={product.length || 0}
                next={fetchMoreProducts}
                hasMore={hasMore}
                loader={hasMore ? (
                    <div className="flex mt-4 justify-center w-full min-h-[55px]">
                        <LoaderCircle className='animate-spin'
                        strokeWidth={2.5} color='#0891b2' size={35} />
                    </div>
                ) : null}
                // loader={
                //     <div className='mt-6 grid grid-cols-2 xl:grid-cols-4 md:grid-cols-3 gap-4'>
                //         {Array.from({length:8}).map((_,index) => (
                //             <Skeleton key={index} />
                //         ))}
                //     </div>
                // }
                // loader={<h3 className="text-2xl text-center text-red-500 mt-2">Loading...</h3>}
            >
                {/* <div className="grid grid-cols-2 xl:grid-cols-4 md:grid-cols-3 gap-4" >
                    {product?.map((pro, index) => (
                        <div key={index}>
                            <img 
                                width={200}
                                className=' object-contain object-center' 
                                src={`http://localhost:5000${pro.imageUrl}`}
                                alt="в этом товаре нету изображения"
                            />
                            {pro.title}
                            <br />
                            {pro.price}
                        </div>
                    ))}
                </div> */}

                   <CardList 
                        items={product}
                        isLoading={isLoading}
                        error={isError}
                        errorText={error?.message}
                        text={debouncedQuery}
                    />
            </InfiniteScroll>

        </div>
    );
};

export default Home;