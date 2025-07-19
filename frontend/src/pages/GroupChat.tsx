import React from 'react'

const GroupChat = () => {
    return (
        <section className='bg-white p-4 h-screen w-full'>
            <h1 className='text-lg font-semibold'>Group Chat</h1>
            <div className='flex flex-col'>
                <div className='p-2 bg-neutral-200 border border-white'>
                    <h2>Group Name</h2>
                    <p>Group description or details can go here.</p>
                </div>
                {/* Additional group chat content can be added here */}
            </div>
        </section>
    )
}

export default GroupChat