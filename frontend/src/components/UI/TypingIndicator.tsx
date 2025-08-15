

const TypingIndicator = () => {
    return (
        <div className='flex items-center gap-1  font-serif italic text-sm '>
            {
                [1, 2, 3].map(d => <div key={d} className='animate-dotPulse w-2 h-2 rounded-full ' style={{ animationDelay: `${d * 0.2}s` }}  ></div>)
            }
            Typing
        </div>
    )
}

export default TypingIndicator