import React, { useState, useEffect } from 'react'
import ProductCard from './ProductCard'

const TopRated = () => {
  const [topRatedProducts, setTopRatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchTopRatedProducts()
  }, [])

  const fetchTopRatedProducts = async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await fetch('http://localhost:4000/api/product/top-rated?limit=4');
      const data = await response.json()
      
      if (data.success) {
        setTopRatedProducts(data.products)
      } else {
        setError(data.message || 'Failed to fetch top rated products')
      }
    } catch (error) {
      console.error('Error fetching top rated products:', error)
      setError('Failed to load top rated products')
    } finally {
      setLoading(false)
    }
  }

  const renderLoadingSkeleton = () => (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6'>
      {[1, 2, 3, 4].map(i => (
        <div key={i} className='animate-pulse bg-gray-200 h-80 rounded-md'></div>
      ))}
    </div>
  )

  const renderError = () => (
    <div className='text-center py-8'>
      <p className='text-red-500 mb-4'>{error}</p>
      <button 
        onClick={fetchTopRatedProducts}
        className='px-4 py-2 bg-[#bb86fc] text-white rounded hover:bg-[#9b6fe5] transition'
      >
        Retry
      </button>
    </div>
  )

  const renderProducts = () => {
    if (topRatedProducts.length === 0) {
      return (
        <div className='text-center text-gray-500 py-8'>
          No top rated products available
        </div>
      )
    }

    return (
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6'>
        {topRatedProducts.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    )
  }

  return (
    <section className='mt-9 px-6 md:px-16 lg:px-24 xl:px-32 mb-16'>
      <div className='text-center mb-6'>
        <h2 className='text-2xl font-medium text-[#6b46c1]'>Top Rated</h2>
        <div className='w-16 h-0.5 bg-[#bb86fc] rounded-full mt-2 mx-auto'></div>
      </div>
      
      {loading && renderLoadingSkeleton()}
      {error && !loading && renderError()}
      {!loading && !error && renderProducts()}
    </section>
  )
}

export default TopRated