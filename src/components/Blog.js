import React, {useState} from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, user, removeBlog, like }) => {
  const [viewFull, setViewFull] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

  const hideWhenViewFull = { display: viewFull ? 'none' : '' }
  const showWhenViewFull = { display: viewFull ? '' : 'none' }

  let username

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleViewFull = () => {
    setViewFull(!viewFull)
  }

  if (blog.user) {
    username = blog.user.username
  }

  const removeBlogButton = () => {
    if (blog.user) {
      if (blog.user.username === user.username) {
        return (
          <div>
            <button className="removeButton" onClick={remove}>Remove</button>
          </div>
        )
      }
    }
  }

 const addLike = () => {
   const newBlog = {likes: blog.likes += 1}
   console.log(newBlog)
   setLikes(newBlog.likes)
   console.log(blog.id)
   like(blog.id, newBlog)
 }

 const remove = () => {
   const confirmDelete = window.confirm(`Remove blog ${blog.title}`)
   if (confirmDelete) {
     removeBlog(blog.id)
   }
 }

  return (
    <div style={blogStyle} className="blog">
      <strong><span className="title">{blog.title}</span></strong><span className="author"> {blog.author}</span>
      <button className="viewButton" onClick={toggleViewFull} style={hideWhenViewFull}>view</button>
      <button onClick={toggleViewFull} style={showWhenViewFull}>hide</button>

      <div style={showWhenViewFull} className="togglableContent">
        <span className="url">{blog.url}</span>
        <br/>
        likes: <span className="likes">{likes}</span> <button className="likeButton" onClick={addLike}>like</button>
        <br/>
        {username}
        {removeBlogButton()}
      </div>
    </div>
  )
}

export default Blog
