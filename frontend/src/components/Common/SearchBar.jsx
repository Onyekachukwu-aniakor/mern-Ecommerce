import React, { useState } from 'react'
import { HiMagnifyingGlass, HiMiniXMark } from 'react-icons/hi2';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProductsByFilters, setFilters } from '../../redux/slices/productsSlice';

const SearchBar = () => {

    const [searchTerm, setSearchTerm]= useState('');
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSearchToggle = ()=>{
        setIsOpen(!isOpen)
    }

    const handleSearch =(e)=>{
        e.preventDefault();
        /* console.log('search term:', searchTerm) */
        dispatch(setFilters({search : searchTerm}));
        dispatch(fetchProductsByFilters({search:searchTerm}));
        navigate(`/collections/all?search=${searchTerm}`)
        setIsOpen(false)

    }
  return (
    <div className={`flex w-full items-center justify-center transition-all duration-300 ${isOpen ? "absolute top-0 left-0 w-full bg-white h-24 z-50" : "w-auto "} `}>
        {isOpen 
        ? (<form  onSubmit={handleSearch} className='relative flex justify-center items-center w-full'>
            <div className='relative w-1/2'>
            <input type="text" placeholder='search' onChange={(e)=>setSearchTerm(e.target.value)} value={searchTerm} className='py-2 px-4 bg-gray-100 pr-12 pl-2 rounded-lg focus:outline-none w-full placeholder:text-gray-700'/>
            {/* {search icon} */}
            <button type='submit' className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800'> 
                <HiMagnifyingGlass className='w-6 h-6'/>
            </button>

            </div>
            {/* {Close Icon} */}
            <button type='button' className='absolute right-4 top-1/2 transform -transilate-y-1/2 text-gray-600 hover:text-gray-800' onClick={handleSearchToggle}>
                <HiMiniXMark className='h-6 w-6'/>
            </button>
        </form>) 
        : (
            <button onClick={handleSearchToggle}>
                <HiMagnifyingGlass className='h-6 w-6'/>

            </button>
           )}
    </div>
  )
}

export default SearchBar