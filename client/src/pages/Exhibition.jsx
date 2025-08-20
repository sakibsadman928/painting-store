import React, { useState, useEffect } from 'react';
import ExhibitionCard from '../components/ExhibitionCard';

const Exhibition = () => {
    const [exhibitions, setExhibitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCurrentMonthExhibitions();
    }, []);

    const fetchCurrentMonthExhibitions = async () => {
        try {
            setLoading(true);
            setError('');
            
            const response = await fetch('http://localhost:4000/api/exhibition/current');
            const data = await response.json();
            
            if (data.success) {
                setExhibitions(data.exhibitions);
            } else {
                setError(data.message || 'Failed to fetch exhibitions');
            }
        } catch (error) {
            console.error('Error fetching exhibitions:', error);
            setError('Failed to load exhibitions');
        } finally {
            setLoading(false);
        }
    };

    const getCurrentMonthName = () => {
        const currentDate = new Date();
        return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    const renderLoadingSkeleton = () => (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8'>
            {[1, 2, 3].map(i => (
                <div key={i} className='animate-pulse bg-gray-200 h-96 rounded-lg'></div>
            ))}
        </div>
    );

    const renderError = () => (
        <div className='text-center py-12'>
            <div className='mb-4'>
                <svg className='mx-auto h-16 w-16 text-gray-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                </svg>
            </div>
            <p className='text-gray-500 mb-4'>{error}</p>
            <button 
                onClick={fetchCurrentMonthExhibitions}
                className='px-6 py-2 bg-[#bb86fc] text-white rounded-lg hover:bg-[#9b6fe5] transition'
            >
                Retry
            </button>
        </div>
    );

    const renderExhibitions = () => {
        if (exhibitions.length === 0) {
            return (
                <div className='text-center py-12'>
                    <div className='mb-4'>
                        <svg className='mx-auto h-16 w-16 text-gray-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h3z' />
                        </svg>
                    </div>
                    <h3 className='text-lg font-medium text-gray-900 mb-2'>No exhibitions scheduled</h3>
                    <p className='text-gray-500'>
                        There are no exhibitions scheduled for {getCurrentMonthName()}.
                    </p>
                </div>
            );
        }

        return (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8'>
                {exhibitions.map(exhibition => (
                    <ExhibitionCard key={exhibition._id} exhibition={exhibition} />
                ))}
            </div>
        );
    };

    return (
        <div className='mt-16 px-6 md:px-16 lg:px-24 xl:px-32 mb-16'>
            <div className='flex flex-col items-center w-full mb-12'>
                <h1 className='text-3xl font-bold text-[#6b46c1] mb-2'>Art Exhibitions</h1>
                <div className='w-20 h-0.5 bg-[#bb86fc] rounded-full mb-4'></div>
                <p className='text-gray-600 text-center max-w-2xl'>
                    Discover and experience captivating art exhibitions featuring works from talented artists.
                    Join us for an inspiring journey through creativity and artistic expression.
                </p>
                <div className='mt-4 px-4 py-2 bg-[#bb86fc]/10 rounded-full border border-[#bb86fc]/30'>
                    <span className='text-[#6b46c1] font-medium'>
                        {getCurrentMonthName()} Events
                    </span>
                </div>
            </div>

            {loading && renderLoadingSkeleton()}
            {error && !loading && renderError()}
            {!loading && !error && renderExhibitions()}
        </div>
    );
};

export default Exhibition;