import React, {useState} from 'react'

const BlogForm = ({ createBlog, user }) => {

  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }

  const addBlog = (event) => {
    event.preventDefault()
    if (newTitle && newAuthor && newUrl) {
    createBlog({
        title: newTitle,
        author: newAuthor,
        url: newUrl,
        user: user
    })
      setNewTitle('')
      setNewAuthor('')
      setNewUrl('')
    }
  }

  return (
    <div>
    <h2>Create new</h2>
    <form onSubmit={addBlog}>
    <div>
      title:
        <input
        id="title"
        type="text"
        value={newTitle}
        onChange={handleTitleChange}
      />
    </div>
    <div>
      author:
        <input
        id="author"
        type="text"
        value={newAuthor}
        onChange={handleAuthorChange}
      />
    </div>
    <div>
      url:
        <input
        id="url"
        type="text"
        value={newUrl}
        onChange={handleUrlChange}
      />
    </div>
    <button id="createBlog" type="submit">Create</button>
    </form>
    </div>
  )
}

export default BlogForm
