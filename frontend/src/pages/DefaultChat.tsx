

const DefaultChat = () => {
    return (
        <section className=' h-full relative border border-neutral-200 shadow  flex flex-col items-center justify-center rounded-lg overflow-hidden bg-white'>
            <img src="/icons/message-dots.svg" alt="message icons" className="w-28" />
            <p className="text-lg font-semibold text-neutral-700 font-serif">Please select a user or a group to chat.</p>
        </section>
    )
}

export default DefaultChat