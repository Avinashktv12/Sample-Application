import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/:id', 'ProfilesController.show').as('show')
  Route.post('/', 'ProfilesController.create').as('create')
  Route.put('/', 'ProfilesController.update').as('update')
  Route.delete('/', 'ProfilesController.destroy').as('destroy')
})
  .prefix('/user/profile')
  .as('profile')
  .namespace('App/Controllers/Http')
  .middleware(['auth'])
