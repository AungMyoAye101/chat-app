import React from 'react'
import { useParams } from 'react-router-dom'

const UserChat = () => {
    const { userId } = useParams()
    return (
        <div>UserChat
            <div>{userId}</div>
        </div>
    )
}

export default UserChat