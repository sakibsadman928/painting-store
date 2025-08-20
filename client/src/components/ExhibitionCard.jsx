import React, { useState } from 'react';
import TicketModal from './TicketModal';

const ExhibitionCard = ({ exhibition }) => {
    const [showModal, setShowModal] = useState(false);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'sold-out':
                return 'bg-red-100 text-red-800';
            case 'completed':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'active':
                return 'Available';
            case 'sold-out':
                return 'Sold Out';
            case 'completed':
                return 'Completed';
            default:
                return status;
        }
    };

    const getImageUrl = () => {
        if (exhibition.image) {
            return `http://localhost:4000/images/${exhibition.image}`;
        }
        return '/placeholder-exhibition.jpg';
    };

    return (
        <>
            <div className='bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-[#bb86fc]/20'>
                <div className='relative h-48 bg-gradient-to-br from-[#bb86fc]/20 to-[#6b46c1]/20'>
                    <img 
                        src={getImageUrl()}
                        alt={exhibition.title}
                        className='w-full h-full object-cover'
                        onError={(e) => {
                            e.target.src = '/placeholder-exhibition.jpg';
                        }}
                    />
                    <div className='absolute top-4 right-4'>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(exhibition.status)}`}>
                            {getStatusText(exhibition.status)}
                        </span>
                    </div>
                </div>
                
                <div className='p-6'>
                    <h3 className='text-xl font-bold text-[#6b46c1] mb-2 line-clamp-2'>
                        {exhibition.title}
                    </h3>
                    
                    <p className='text-gray-600 text-sm mb-4 line-clamp-3'>
                        {exhibition.description}
                    </p>
                    
                    <div className='space-y-2 mb-4'>
                        <div className='flex items-center text-sm text-gray-700'>
                            <svg className='w-4 h-4 mr-2 text-[#bb86fc]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h3z' />
                            </svg>
                            {formatDate(exhibition.eventDate)}
                        </div>
                        
                        <div className='flex items-center text-sm text-gray-700'>
                            <svg className='w-4 h-4 mr-2 text-[#bb86fc]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                            </svg>
                            {formatTime(exhibition.eventTime)}
                        </div>
                        
                        <div className='flex items-center text-sm text-gray-700'>
                            <svg className='w-4 h-4 mr-2 text-[#bb86fc]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                            </svg>
                            {exhibition.venue}
                        </div>
                        
                        <div className='flex items-center text-sm text-gray-700'>
                            <svg className='w-4 h-4 mr-2 text-[#bb86fc]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z' />
                            </svg>
                            {exhibition.availableTickets} / {exhibition.totalTickets} tickets available
                        </div>
                    </div>
                    
                    <div className='flex items-center justify-between'>
                        <div className='text-2xl font-bold text-[#bb86fc]'>
                            ${exhibition.ticketPrice}
                            <span className='text-sm font-normal text-gray-500 ml-1'>per ticket</span>
                        </div>
                        
                        <button
                            onClick={() => setShowModal(true)}
                            disabled={exhibition.status !== 'active'}
                            className={`px-6 py-2 rounded-lg font-medium transition ${
                                exhibition.status === 'active'
                                    ? 'bg-[#bb86fc] text-white hover:bg-[#9b6fe5] cursor-pointer'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            {exhibition.status === 'active' ? 'Buy Tickets' : 'Unavailable'}
                        </button>
                    </div>
                </div>
            </div>
            
            {showModal && (
                <TicketModal 
                    exhibition={exhibition} 
                    onClose={() => setShowModal(false)} 
                />
            )}
        </>
    );
};

export default ExhibitionCard;