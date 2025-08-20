import React, { useState, useEffect, useCallback } from 'react'
import ProductCard from '../components/ProductCard'
import { useAppContext } from '../context/AppContext'

const Products = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [sortOption, setSortOption] = useState('')
    const [inStockOnly, setInStockOnly] = useState(false)
    const [pagination, setPagination] = useState({})
    const [currentPage, setCurrentPage] = useState(1)

    const { searchTerm, setSearchTerm } = useAppContext()

    const fetchProducts = useCallback(async (params = {}) => {
        try {
            setLoading(true)
            setError('')
            
            const queryParams = new URLSearchParams({
                page: currentPage,
                limit: 20,
                ...params
            })

            if (searchTerm) queryParams.set('search', searchTerm)
            if (sortOption) queryParams.set('sortBy', sortOption)
            if (inStockOnly) queryParams.set('inStockOnly', 'true')

            const response = await fetch(`http://localhost:4000/api/product/list?${queryParams}`)
            const data = await response.json()
            
            if (data.success) {
                setProducts(data.products)
                setPagination(data.pagination || {})
            } else {
                setError(data.message || 'Failed to fetch products')
            }
        } catch (error) {
            console.error('Error fetching products:', error)
            setError('Failed to load products')
        } finally {
            setLoading(false)
        }
    }, [searchTerm, sortOption, inStockOnly, currentPage])

    useEffect(() => {
        fetchProducts()
    }, [fetchProducts])

    useEffect(() => {
        setCurrentPage(1)
    }, [searchTerm, sortOption, inStockOnly])

    const handleSortChange = (e) => {
        setSortOption(e.target.value)
        setCurrentPage(1)
    }

    const handleStockFilterChange = (e) => {
        setInStockOnly(e.target.value === 'instock')
        setCurrentPage(1)
    }

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleRetry = () => {
        fetchProducts()
    }

    const clearFilters = () => {
        setSortOption('')
        setInStockOnly(false)
        setSearchTerm('')
        setCurrentPage(1)
    }

    const renderLoadingSkeleton = () => (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6'>
            {[...Array(10)].map((_, i) => (
                <div key={i} className='animate-pulse bg-gray-200 h-80 rounded-md'></div>
            ))}
        </div>
    )

    const renderError = () => (
        <div className='text-center py-8'>
            <p className='text-red-500 mb-4'>{error}</p>
            <button 
                onClick={handleRetry}
                className='px-4 py-2 bg-[#bb86fc] text-white rounded hover:bg-[#9b6fe5] transition'
            >
                Retry
            </button>
        </div>
    )

    const renderPagination = () => {
        if (!pagination.totalPages || pagination.totalPages <= 1) return null

        const pages = []
        const maxPagesToShow = 5
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))
        let endPage = Math.min(pagination.totalPages, startPage + maxPagesToShow - 1)

        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1)
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i)
        }

        return (
            <div className='flex justify-center items-center mt-8 space-x-2'>
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className='px-3 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100'
                >
                    Previous
                </button>

                {startPage > 1 && (
                    <>
                        <button
                            onClick={() => handlePageChange(1)}
                            className='px-3 py-2 border rounded hover:bg-gray-100'
                        >
                            1
                        </button>
                        {startPage > 2 && <span className='px-2'>...</span>}
                    </>
                )}

                {pages.map(page => (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 border rounded ${
                            currentPage === page 
                                ? 'bg-[#bb86fc] text-white' 
                                : 'hover:bg-gray-100'
                        }`}
                    >
                        {page}
                    </button>
                ))}

                {endPage < pagination.totalPages && (
                    <>
                        {endPage < pagination.totalPages - 1 && <span className='px-2'>...</span>}
                        <button
                            onClick={() => handlePageChange(pagination.totalPages)}
                            className='px-3 py-2 border rounded hover:bg-gray-100'
                        >
                            {pagination.totalPages}
                        </button>
                    </>
                )}

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className='px-3 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100'
                >
                    Next
                </button>
            </div>
        )
    }

    const renderProducts = () => {
        if (products.length === 0) {
            return (
                <div className='col-span-full text-center py-8'>
                    <p className='text-gray-500 mb-4'>
                        {searchTerm ? `No paintings found for "${searchTerm}"` : 'No paintings available'}
                    </p>
                    {(searchTerm || sortOption || inStockOnly) && (
                        <button 
                            onClick={clearFilters}
                            className='px-4 py-2 bg-[#bb86fc] text-white rounded hover:bg-[#9b6fe5] transition'
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            )
        }

        return (
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6'>
                {products.map(product => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        )
    }

    return (
        <div className='mt-16 px-6 md:px-16 lg:px-24 xl:px-32 mb-16'>
            <div className='flex flex-col items-center w-full mb-8'>
                <h1 className='text-2xl font-medium uppercase text-[#6b46c1]'>All Paintings</h1>
                <div className='w-16 h-0.5 bg-[#bb86fc] rounded-full mt-2'></div>
            </div>

            <div className='flex flex-wrap items-center gap-4 mb-6'>
                <select 
                    value={sortOption} 
                    onChange={handleSortChange}
                    className="border border-[#bb86fc]/30 rounded-md px-4 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#bb86fc] focus:border-[#bb86fc] text-gray-700"
                >
                    <option value="">Sort By</option>
                    <option value="price-low-high">Price: Low to High</option>
                    <option value="price-high-low">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Date: Newest First</option>
                    <option value="oldest">Date: Oldest First</option>
                    <option value="name">Name: A-Z</option>
                </select>

                <select 
                    value={inStockOnly ? 'instock' : 'all'} 
                    onChange={handleStockFilterChange}
                    className="border border-[#bb86fc]/30 rounded-md px-4 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#bb86fc] focus:border-[#bb86fc] text-gray-700"
                >
                    <option value="all">All Products</option>
                    <option value="instock">In Stock Only</option>
                </select>

                {(searchTerm || sortOption || inStockOnly) && (
                    <button 
                        onClick={clearFilters}
                        className="px-4 py-2 text-sm text-[#bb86fc] border border-[#bb86fc] rounded-md hover:bg-[#bb86fc] hover:text-white transition"
                    >
                        Clear Filters
                    </button>
                )}
            </div>

            {loading && renderLoadingSkeleton()}
            {error && !loading && renderError()}
            {!loading && !error && renderProducts()}

            {!loading && !error && products.length > 0 && (
                <div className='mt-8'>
                    <div className='text-center text-gray-600 mb-4'>
                        Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, pagination.totalProducts || 0)} of {pagination.totalProducts || 0} paintings
                    </div>
                    {renderPagination()}
                </div>
            )}
        </div>
    )
}

export default Products