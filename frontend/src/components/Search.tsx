import { useEffect, useState } from 'react'
import UserLoadingUi from './UI/UserLoadingUi'
import { axiosInstance } from '@/lib/axios.config'
import type { GroupTypes, UserType } from '@/lib/types'
import ImageBox from './ImageBox'
import { Link } from 'react-router-dom'

interface PropType { id: string, name: string, avatar: string, url: string, onClose: () => void }

interface SearchResultType {
    users: UserType[],
    groups: GroupTypes[]
}

const RenderData = ({ id, name, avatar, url, onClose }: PropType) => {
    return <Link to={url}
        onClick={onClose}
        className='w-full flex items-center  gap-2 bg-white hover:bg-purple-200 shadow py-1 px-2 rounded-md' key={id}>
        <ImageBox name={name} avatar={avatar} size='md' />
        <h4 className='font-medium font-serif'>{name}</h4>
    </Link>
}
const Search = () => {
    const [searchText, setSearchText] = useState('')
    const [searchResult, setSearchResult] = useState<SearchResultType>({
        users: [],
        groups: []
    })
    const [isLoading, setIsLoading] = useState(false)
    const [openSearchBox, setOpenSearchBox] = useState(false)

    useEffect(() => {
        if (!searchText.trim()) return
        const debounce = setTimeout(async () => {
            setIsLoading(true)
            try {
                const res = await axiosInstance.get('/api/search/' + searchText)
                console.log(res.data, "from server")
                setSearchResult(res.data)
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value
        setSearchText(text)
        if (!searchText.trim()) return
        setOpenSearchBox(true)

    }


    return (
        <section className='relative  flex items-center min-w-2xs flex-1 max-w-xl   '>

            <form className='w-full flex border-2 border-neutral-200 rounded-full '>
                <input
                    type="text"
                    value={searchText}
                    className='flex-1 px-4 py-2 border-r border-neutral-200 text-neutral-700'
                    placeholder='Search user or group name'
                    onChange={(e) => handleChange(e)}
                />
                <button className='py-2 px-4'><img src="/icons/search.svg" alt="search icon" className='w-6' /></button>
            </form>
            {
                openSearchBox &&
                <div className='absolute     top-16  w-full z-20'>
                    {
                        isLoading ? <UserLoadingUi />
                            : <div className='flex flex-col gap-2 bg-neutral-100 border border-neutral-200 shadow rounded-lg p-4'>

                                {searchResult.groups.length > 0 &&
                                    <div className='space-y-2'>
                                        <h2 className='font-medium text-lg font-serif'>Group</h2>
                                        {
                                            searchResult.groups.map(g => <RenderData id={g._id} name={g.name} avatar={g.avatar!} url={'/group/' + g._id} key={g._id} onClose={() => setOpenSearchBox(false)} />)

                                        }
                                    </div>
                                }
                                {

                                    searchResult.users.length > 0 &&
                                    <div className='space-y-2'>
                                        <h2 className='font-medium text-lg font-serif'>Users</h2>
                                        {searchResult.users.map(u => <RenderData id={u._id} name={u.name} avatar={u.avatar!} url={'/user/' + u._id} key={u._id} onClose={() => setOpenSearchBox(false)} />)}
                                    </div>
                                }

                            </div>

                    }
                </div>
            }

        </section>
    )
}

export default Search