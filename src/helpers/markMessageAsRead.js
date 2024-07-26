const markMessageAsRead = async (chatId, account) => {
    try {
        const request = await fetch(`/api/chats/update-chat-last-msg-status/${chatId}/`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              account,
              last_message_from_user: false
            })
        })
        
        return request.json()
    } catch (error) {
        console.log(error);
        return Promise.reject(error)
    }
}

export default markMessageAsRead
