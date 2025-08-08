
const DefaultChat = () => {
    return (
        <section className=' h-full relative border border-red-500 flex flex-col  rounded-lg overflow-hidden'>

            <div className="w-full bg-purple-400 h-[20%]"><div className="w-12 h-12 bg-green-600">K</div></div>
            <div className="bg-blue-400  h-[70%] overflow-hidden overflow-y-scroll flex flex-col gap-4 no-scrollbar p-4">

                {
                    Array(3).fill(null).map((_, n) => <div key={n} className='w-10 h-10 bg-orange-600'>{n}</div>)
                }
            </div>
            <form className='flex  bg-yellow-400 h-[10%]'>
                <input type="text" className='flex-1' />
                <button className='px-4 py-1 bg-blue-400 text-white'>Send</button>
            </form>
        </section>
    )
}

export default DefaultChat