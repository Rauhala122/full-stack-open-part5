import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [messageClass, setMessageClass] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)

  const blogFormRef = React.createRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  blogs.sort((a, b) => -(a.likes - b.likes))

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

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleLogin={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService.create(blogObject).then(returnedBlog => {
      setBlogs(blogs.concat(returnedBlog))
      setMessage("Blog created successfully")
      setMessageClass("success")
      setTimeout(() => {
        setMessage(null)
        setMessageClass(null)
      }, 5000)
    })
  }

  const like = (id, blogObject) => {
    blogService.replace(id, blogObject)
  }

  const removeBlog = (id) => {
    blogService.deleteBlog(id).then(returnedBlog => {
      setBlogs(blogs.filter(blog => blog.id !== id))
    })
  }

  const logOutButton = () => (
    <button onClick={handleLogout}>Logout</button>
  )

  return (
    <div>
      <h1>Blogs App</h1>
      <Notification message={message} messageClass={messageClass}/>
      {user === null ?
      loginForm() :
      <div>

        <p>{user.username} logged in {logOutButton()}</p>

        <Togglable buttonLabel="new blog" ref={blogFormRef}>
          <BlogForm createBlog={addBlog} user={user}/>
        </Togglable>

        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} user={user} removeBlog={removeBlog} like={like}/>
        )}


      </div>
      }
    </div>
  )
}

export default App
