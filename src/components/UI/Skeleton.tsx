const Skeleton = () => {
    return (
        <div className='h-full w-full'>
            <div className="animate-pulse border rounded-3xl p-8 border-slate-200">
                <div className="bg-gray-300 h-40 mb-4 rounded-xl"></div>
                <div className="bg-gray-300 h-4 mb-2 rounded-xl"></div>
                <div className="bg-gray-300 h-4 w-2/3 mb-2 rounded-xl"></div>
                <div className='flex justify-between'>
                    <div className="bg-gray-300 h-6 w-1/2 mt-4 rounded-xl flex flex-col"></div>
                    <div className="bg-gray-300 h-8 w-8 mt-3 rounded-md"></div>
                </div>
            </div>
        </div>
    );
};

export default Skeleton;