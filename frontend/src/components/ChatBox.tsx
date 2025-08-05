

const ChatBox = () => {
    return (
        <section className='flex flex-col gap-4 bg-blue-100 h-screen overflow-hidden  overflow-y-scroll  relative '>
            <div className='bg-white flex gap-2 px-4 py-1 items-center sticky top-0 w-full'>
                <div className='w-12 h-12 bg-green-400 '>k</div>
            </div>
            <div className='h-full'>

            </div>
            <form className='flex bg-white'>
                <input type="text" className='flex-1' />
                <button className='px-4 py-1 bg-blue-400 text-white'>Send</button>
            </form>
        </section >
    )
}

export default ChatBox