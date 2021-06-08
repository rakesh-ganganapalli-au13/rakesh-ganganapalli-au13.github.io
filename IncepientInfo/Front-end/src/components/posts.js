import axios from 'axios'
import React,{useEffect,useState} from 'react'
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table'
function Posts() {
 
    const [index,setIndex]  = useState(0)
    const [posts,setPost]   = useState([])
    const [error,setError]  = useState('')

    useEffect(() => {
        try{
            axios.get(`http://localhost:8888/api/posts/${index}`)
            .then(data => {
                data.data.posts[0]===null?setError('somthing happend data not available'):setPost(data.data.posts)
            })
            .catch(e=>setError('somthing happend'))
        }catch(e){
            setError('somthing happend')
        }
        
    }, [index])

    const handleClick = ()=>{
        setIndex(index+1)
    }

    const handleClick2 = ()=>{
        if(index<=0) return setIndex(0)
        setIndex(index-1)
    }

    return (
        <>
        {!error?<div>
            <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                    <th>PostId</th>
                    <th>UserId</th>
                    <th>Title</th>
                    <th>Body</th>
                    </tr>
                </thead>
                <tbody>
                {posts.map((post,i)=>{

                    return (
                        <tr key={i}>
                        <td>{post.id}</td>
                        <td>{post.userId}</td>
                        <td>{post.title}</td>
                        <td>{post.body}</td>
                        </tr>)
                })}
                </tbody>
            </Table>

            <Button variant="primary" onClick={handleClick2}>Prev</Button>{' '}
            <Button variant="primary" onClick={handleClick}>Next</Button>{' '}
            </div> : <h1>{error}</h1> }

        </>
    )
}

export default Posts
