import React from 'react';

const Contact = () => {
    return (
        <div className='mt-16 px-6 md:px-16 lg:px-24 xl:px-32 mb-16'>
            <div className='flex flex-col items-center w-full mb-12'>
                <h1 className='text-3xl font-bold text-[#6b46c1] mb-2'>Contact Us</h1>
                <div className='w-20 h-0.5 bg-[#bb86fc] rounded-full mb-4'></div>
                <p className='text-gray-600 text-center max-w-2xl'>
                    Visit our gallery or get in touch with us. We'd love to help you discover the perfect artwork 
                    for your space or answer any questions about our exhibitions.
                </p>
            </div>

            <div className='max-w-2xl mx-auto'>
                <div className='bg-white rounded-lg shadow-lg p-8 border border-[#bb86fc]/20'>
                    <h2 className='text-2xl font-semibold text-[#6b46c1] mb-8 text-center'>Get In Touch</h2>
                    
                    <div className='space-y-8'>
                        <div className='flex items-start space-x-4'>
                            <div className='flex-shrink-0'>
                                <svg className='w-6 h-6 text-[#bb86fc] mt-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                                </svg>
                            </div>
                            <div>
                                <h3 className='text-lg font-medium text-gray-900 mb-1'>Visit Our Gallery</h3>
                                <p className='text-gray-600'>123 Art Street<br />Creative District<br />New York, NY 10001</p>
                            </div>
                        </div>

                        <div className='flex items-start space-x-4'>
                            <div className='flex-shrink-0'>
                                <svg className='w-6 h-6 text-[#bb86fc] mt-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                                </svg>
                            </div>
                            <div>
                                <h3 className='text-lg font-medium text-gray-900 mb-1'>Call Us</h3>
                                <p className='text-gray-600'>+1 (555) 123-4567</p>
                                <p className='text-gray-500 text-sm'>Mon - Fri: 9:00 AM - 6:00 PM</p>
                            </div>
                        </div>

                        <div className='flex items-start space-x-4'>
                            <div className='flex-shrink-0'>
                                <svg className='w-6 h-6 text-[#bb86fc] mt-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                                </svg>
                            </div>
                            <div>
                                <h3 className='text-lg font-medium text-gray-900 mb-1'>Email Us</h3>
                                <p className='text-gray-600'>info@paletteplay.com</p>
                                <p className='text-gray-500 text-sm'>We'll respond within 24 hours</p>
                            </div>
                        </div>

                        <div className='flex items-start space-x-4'>
                            <div className='flex-shrink-0'>
                                <svg className='w-6 h-6 text-[#bb86fc] mt-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                                </svg>
                            </div>
                            <div>
                                <h3 className='text-lg font-medium text-gray-900 mb-1'>Gallery Hours</h3>
                                <p className='text-gray-600'>
                                    Monday - Friday: 10:00 AM - 8:00 PM<br />
                                    Saturday: 9:00 AM - 6:00 PM<br />
                                    Sunday: 12:00 PM - 5:00 PM
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='mt-8 text-center bg-gradient-to-r from-[#bb86fc]/10 to-[#6b46c1]/10 rounded-lg p-6'>
                    <h3 className='text-xl font-semibold text-[#6b46c1] mb-2'>Visit Our Gallery Today!</h3>
                    <p className='text-gray-600 mb-4'>
                        Experience our beautiful collection of paintings and upcoming exhibitions in person. 
                        Free admission to browse our permanent collection.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Contact;