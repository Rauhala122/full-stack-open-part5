import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [messageClass, setMessageClass] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem(
       'loggedNoteappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')

    } catch (exeption) {
      setMessage("wrong username or password")
      setMessageClass("error")
      setTimeout(() => {
        setMessage(null)
        setMessageClass(null)
      }, 5000)
    }

  }

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedNoteappUser')
    setUser(null)
  }

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
    <h2>Log in to application</h2>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const addBlog = (event) => {
    event.preventDefault()
    if (newTitle && newAuthor && newUrl) {
      const blog = {
        title: newTitle,
        author: newAuthor,
        url: newUrl
      }

      blogService.create(blog).then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setMessage("Blog created successfully")
        setMessageClass("success")
        setNewTitle('')
        setNewAuthor('')
        setNewUrl('')
        setTimeout(() => {
          setMessage(null)
          setMessageClass(null)
        }, 5000)
      })
    }
  }

  const addNewBlog = () => (
    <div>
    <h2>Create new</h2>
    <form onSubmit={addBlog}>
    <div>
      title:
        <input
        type="text"
        value={newTitle}
        onChange={handleTitleChange}
      />
    </div>
    <div>
      author:
        <input
        type="text"
        value={newAuthor}
        onChange={handleAuthorChange}
      />
    </div>
    <div>
      url:
        <input
        type="text"
        value={newUrl}
        onChange={handleUrlChange}
      />
    </div>
    <button type="submit">Create</button>
    </form>
    </div>
  )

  const logOutButton = () => (
    <button onClick={handleLogout}>Logout</button>
  )

  return (
    <div>
      <Notification message={message} messageClass={messageClass}/>
      {user === null ?
      loginForm() :
      <div>

        <h2>blogs</h2>
        <p>{user.username} logged in {logOutButton()}</p>

        {addNewBlog()}

        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}


      </div>
      }
    </div>
  )
}

export default App
