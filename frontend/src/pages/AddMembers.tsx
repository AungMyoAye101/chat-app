import React from 'react'

const AddMembers = () => {
    return (
        <section className=''>
            <div className='flex flex-col gap-4' >
                <div className='flex w-full gap-4'><input type="text" className='flex-1' /><button>search</button></div>
                <div className='flex flex-col  border '>
                    {
                        [1, 2, 3, 4, 5].map((item) => (
                            <div key={item} className='flex items-center justify-between px-4 py-1 hover:bg-gray-200 cursor-pointer'>

                                <div className='flex items-center gap-2'>
                                    <div className='w-10 h-10 rounded-full bg-gray-300 flex justify-center items-center'>A</div>
                                    <span>John Doe</span>
                                </div>
                                <button className='text-blue-500'>Add</button>
                            </div>
                        ))
                    }

                </div>
            </div>
        </section>
    )
}

export default AddMembers