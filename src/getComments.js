const getComments = () => fetch('https://jsonplaceholder.typicode.com/comments').then(
    res => {
        if (res.ok) {
            return res.json();
        } else {
            throw Error('oops');
        }
    }
)

export { getComments };