import React, { useState } from 'react'
import UserLoadingUi from './UI/UserLoadingUi'



const Search = () => {
    const [searchText, setSearchText] = useState('')
    return (
        <section className='relative  flex items-center min-w-2xs flex-1 max-w-xl   '>

            <form className='w-full flex border-2 border-neutral-200 rounded-full '>
                <input
                    type="text"
                    value={searchText}
                    className='flex-1 px-4 py-2 border-r border-neutral-200 text-neutral-700'
                    placeholder='Search user or group name'
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <button className='py-2 px-4'><img src="/icons/search.svg" alt="search icon" className='w-6' /></button>
            </form>
            <div className='absolute     top-16  w-full z-20'>
                {
                    searchText ? <UserLoadingUi /> :
                        <div>
                            Search data
                        </div>

                }
            </div>
        </section>
    )
}

export default Search