
const DefaultChat = () => {
    return (
        <section className='flex flex-col gap-4 bg-blue-100 h-screen overflow-hidden  overflow-y-scroll py-12 relative '>
            {/* <div className='font-semibold font-serif font-lg '>
                Please select to chat
            </div> */}
            <div className="sticky top-0 w-full bg-white"><div className="w-12 h-12 bg-green-600">K</div></div>
            {
                Array(40).fill(null).map((_, n) => <div key={n} className='w-10 h-10 bg-orange-600'>{n}</div>)
            }
            <form className='flex sticky bottom-0 w-full'>
                <input type="text" className='flex-1' />
                <button className='px-4 py-1 bg-blue-400 text-white'>Send</button>
            </form>
        </section>
    )
}

export default DefaultChat