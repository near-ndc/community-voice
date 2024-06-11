function getCategories() {
    return [
        {
            title: 'All categories',
            color: 'transparent',
            value: 'all_categories',
        },
        {
            title: 'Chatter',
            color: '#f7941d',
            value: 'chatter',
        },
        {
            title: 'Voting',
            color: '#92278f',
            value: 'voting',
        },
        {
            title: 'Games',
            color: '#08c',
            value: 'games',
        },
        {
            title: 'Contests',
            color: '#9eb83b',
            value: 'contests',
        },
    ]
}

return { getCategories }
