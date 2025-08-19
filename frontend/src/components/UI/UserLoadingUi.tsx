const UserLoadingUi = () => {
    return (
        <div className='flex flex-col gap-2 bg-neutral-100 border border-neutral-200 shadow rounded-lg p-4'>
            {
                [1, 2, 3, 4, 5, 6].map(n => (
                    <div className='w-full flex items-center justify-center gap-2 bg-white p-1 rounded-md' key={n}>
                        <div className='w-10 h-10 rounded-full bg-neutral-200'></div>
                        <div className='flex-1 h-5 bg-neutral-200 rounded-full'></div>
                    </div>
                ))
            }

        </div>
    )
}

export default UserLoadingUi