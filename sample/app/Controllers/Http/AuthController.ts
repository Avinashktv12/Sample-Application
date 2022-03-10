import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/user'

export default class AuthController {
  public async login({ request, response, auth }: HttpContextContract) {
    const { uid, password } = request.only(['uid', 'password'])
    try {
      await auth.attempt(uid, password)
    } catch (e) {
      return response.json({
        httpStatusCode: '401',
        message: 'please check userName and Password',
        status: 'failed',
      })
    }

    return response.redirect('/user/profile')
  }

  public async register({ request, response, auth }: HttpContextContract) {
    const UsersSchema = schema.create({
      username: schema.string({trim: true},[rules.minLength(3),rules.maxLength(30),rules.unique({table:'sample.users',column:'username',caseInsensitive:true})]),
      email: schema.string({ trim: true }, [
        rules.email(),
        rules.unique({ table: 'sample.users', column: 'email', caseInsensitive: true }),
      ]),
      password: schema.string({ trim: true }, [rules.minLength(8)]),
      mobilenumber: schema.string({ trim: true }, [rules.mobile()]),
    })
    const data = await request.validate({ schema: UsersSchema })
    const user = await User.create(data)
    await auth.login(user)

    return response.json(user)
  }

  public async logout({ response, auth }: HttpContextContract) {
    await auth.logout()
    return response.redirect('/auth/login')
  }
}
