

const DefaultChat = () => {
    return (
        <section className=' h-full relative flex flex-col items-center justify-center bg-white/70'>
            <img src="/icons/message-dots.svg" alt="message icons" className="w-28" />
            <p className="text-lg font-semibold text-neutral-700 font-serif">Please select a user or a group to chat.</p>
        </section>
    )
}

export default DefaultChat