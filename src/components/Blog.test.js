import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'
import Blog from './Blog'

describe('<Togglable />', () => {

  let component

  const mockHandler = jest.fn()

  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: "Saska Rauhala",
    likes: 10
  }

  beforeEach(() => {
    component = render(
      <Blog blog={blog} like={mockHandler}/>
    )
  })

  test('renders content', () => {

    const title = component.container.querySelector(".title")
    const author = component.container.querySelector(".author")
    const url = component.container.querySelector(".url")
    const likes = component.container.querySelector(".likes")

    expect(title).toHaveTextContent(blog.title)
    expect(author).toHaveTextContent(blog.author)

    if (blog.url) {
      expect(url).toHaveTextContent(blog.url)
    }

    if (blog.likes) {
      expect(likes).toHaveTextContent(blog.likes)
    }
  })

  test('at start the children are not displayed', () => {
      const div = component.container.querySelector('.togglableContent')

      expect(div).toHaveStyle('display: none')
    })

  test('after clicking the button, children are displayed', () => {
    const viewButton = component.container.querySelector(".viewButton")
    fireEvent.click(viewButton)

    const div = component.container.querySelector('.togglableContent')
    expect(div).not.toHaveStyle('display: none')
  })

  test('after clicking the like button twice, the likes function is called twice', () => {
    const likeButton = component.container.querySelector(".likeButton")
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)
    expect(mockHandler.mock.calls).toHaveLength(2)
  })

})
