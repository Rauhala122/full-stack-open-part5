Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', 'http://localhost:3003/api/login', {
    username, password
  }).then(({ body }) => {
    localStorage.setItem('loggedNoteappUser', JSON.stringify(body))
    cy.visit('http://localhost:3000')
  })
})

Cypress.Commands.add('createBlog', ({ title, author, url, likes  }) => {
  cy.request({
    url: 'http://localhost:3003/api/blogs',
    method: 'POST',
    body: { title, author, url, likes }
    headers: {
      'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedNoteappUser')).token}`
    }
  })

  cy.visit('http://localhost:3000')
})

describe('Blog ', function()

  beforeEach(function() {
      cy.request('POST', 'http://localhost:3003/api/testing/reset')
      const user = {
        name: 'Saska Rauhala',
        username: 'rauhala150',
        password: 'salainen'
      }
      cy.request('POST', 'http://localhost:3003/api/users/', user)
      cy.visit('http://localhost:3000')
    })


  it('front page can be opened', function() {
    cy.contains('Blogs App')
  })


  it('login fails with wrong password', function() {
    cy.contains('log in').click()
    cy.get('#username').type("rauhala150")
    cy.get('#password').type("wrong")
    cy.get("#login-button").click()
    cy.get(".error").contains("wrong username or password")
  })

  it('user can log in', function() {
    cy.contains('log in').click()
    cy.get('#username').type("rauhala150")
    cy.get('#password').type("salainen")
    cy.get("#login-button").click()
    cy.contains("rauhala150 logged in")
  })

  describe("when logged in", function() {
    beforeEach(function() {
      cy.login({ username: "rauhala150", password:  "salainen" })
    })

    it("a new blog can be created", function() {
      cy.contains('new blog').click()
      cy.get('#title').type("Blogi 150")
      cy.get('#author').type("Saska Rauhala")
      cy.get("#url").type("facebook.com")
      cy.get("#createBlog").click()
      cy.contains("Blogi 150")
    })

    it("a blog can be liked", function() {
      cy.createBlog({
        title: "Cypress can create a blog",
        author: "cypress",
        url: "cypress.com"
      })

      cy.contains("Cypress can create a blog").parent().parent().contains("view").click()
      cy.contains("Cypress can create a blog").parent().parent().get(".likeButton").click()
      cy.contains("Cypress can create a blog").parent().parent().get(".likes").should("contain", "1")
    })

    it("a blog can be removed", function() {
      cy.createBlog({
        title: "Cypress can create a blog",
        author: "cypress",
        url: "cypress.com"
      })

      cy.contains("Cypress can create a blog").parent().parent().contains("view").click()
      cy.contains("Cypress can create a blog").parent().parent().get(".removeButton").click()
      cy.should("not.contain", "Cypress can create a blog")
    })

    it("blogs are sorted according to their likes", function() {
      cy.createBlog({
        title: "Cypress can create a blog",
        author: "cypress",
        url: "cypress.com",
        likes: 50
      })

      cy.createBlog({
        title: "Cypress is best",
        author: "Saska Rauhala",
        url: "cypress.com",
        likes: 100
      })

      cy.createBlog({
        title: "Finland is great",
        author: "Marko Rauhala",
        url: "cypress.com",
        likes: 150
      })

      cy.get(".blog:first").contains("150")
      cy.get(".blog:last").contains("50")
    })

  })

})
