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
        className='w-full flex items-center  gap-2 bg-gray-100 hover:bg-purple-200 shadow py-1 px-2 rounded-lg' key={id}>
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
                const result = res.data

                setSearchResult(result)


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

        setOpenSearchBox(text.trim() !== "")

    }


    const renderResultData = searchResult.groups.length === 0 && searchResult.users.length === 0
        ? <div className='bg-neutral-200 border border-neutral-200 shadow rounded-lg h-[calc(100vh-150px)] flex justify-center items-center'>
            <p className='font-serif font-medium text-lg'>No users or groups found!</p>
        </div>
        : <div className='flex flex-col gap-2 bg-neutral-200 border border-neutral-200 shadow rounded-lg p-4'>

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


    return (
        <section className='relative  flex items-center  flex-1   '>

            <form className='w-full flex bg-neutral-200 rounded-full overflow-hidden'>
                <input
                    type="text"
                    value={searchText}
                    className='flex-1 px-4 py-2  text-neutral-700 '
                    placeholder='Search user or group name'
                    onChange={(e) => handleChange(e)}
                />
                <button className='py-2 px-4 '><img src="/icons/maginifying-glass-icon.svg" alt="search icon" className='w-5 bg-transparent' /></button>
            </form>
            {
                openSearchBox &&
                <div className='absolute  top-12  w-full z-20'>
                    {
                        isLoading ? <UserLoadingUi /> : renderResultData

                    }
                </div>
            }

        </section>
    )
}

export default Search