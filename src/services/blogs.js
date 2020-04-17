import axios from 'axios'
const baseUrl = 'http://localhost:3003/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const replace = async (id, newObject) => {
  const response = await axios.put(baseUrl + "/" + id, newObject)
  return response.data
}

const deleteBlog = (id) => {
  const config = {
    headers: { Authorization: token },
  }

  const request = axios.delete(baseUrl + "/" + id, config)
  return request
}

export default { getAll, create, setToken, replace, deleteBlog }
