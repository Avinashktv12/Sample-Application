import Route from '@ioc:Adonis/Core/Route'

  Route.group(() => {
    Route.post('/login', 'AuthController.login').as('login')
    Route.post('/register', 'AuthController.register').as('register')
    Route.post('/logout', 'AuthController.logout').as('logout')
  })
    .prefix('/auth')
    .as('auth').namespace('App/Controllers/Http')