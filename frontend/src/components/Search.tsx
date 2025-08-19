import { useEffect, useState } from 'react'
import UserLoadingUi from './UI/UserLoadingUi'
import { axiosInstance } from '@/lib/axios.config'
import type { UserType } from '@/lib/types'



const Search = () => {
    const [searchText, setSearchText] = useState('')
    const [searchResult, setSearchResult] = useState<UserType[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (!searchText.trim()) return
        const debounce = setTimeout(async () => {
            setIsLoading(true)
            try {
                const res = await axiosInstance.get('/api/search/' + searchText)
                console.log(res.data, "from server")
            } catch (error) {
                console.log(error)
            } finally {
                setIsLoading(false)
            }

        }, 500)

        return () => {
            clearTimeout(debounce)
        }
    }, [searchText])

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
                    isLoading ? <UserLoadingUi />
                        : searchResult.map(u => <div className='w-full flex items-center justify-center gap-2 bg-white p-1 rounded-md' key={u._id}>
                            <div className='w-10 h-10 rounded-full bg-neutral-200'></div>
                            <div className='flex-1 h-5 bg-neutral-200 rounded-full'>{u.name}</div>
                        </div>)

                }
            </div>
        </section>
    )
}

export default Search