import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/userModel'

export default class AuthController {
  public async login({ request, auth }: HttpContextContract) {
    const UsersSchema = schema.create({
      email: schema.string({ trim: true }, [
        rules.email(),
        rules.unique({ table: 'users', column: 'email', caseInsensitive: true }),
      ]),
      password: schema.string({ trim: true }, [rules.minLength(8)])
    })
    const data = await request.validate({ schema: UsersSchema })
    const { email, password } = data
    try {
      await auth.attempt(email, password)
    } catch (e) {
      return {
        httpStatusCode: '401',
        message: 'please check userName and Password',
        status: 'failed',
      }
    }
  }

  public async register({ request, auth }: HttpContextContract) {
    const UsersSchema = schema.create({
      email: schema.string({ trim: true }, [
        rules.email(),
        rules.unique({ table: 'users', column: 'email', caseInsensitive: true }),
      ]),
      password: schema.string({ trim: true }, [rules.minLength(8)])
    })
    const data = await request.validate({ schema: UsersSchema })
    const user = await User.create(data)
    await auth.login(user)

    return user
  }

  public async logout({ auth }: HttpContextContract) {
    await auth.logout()
    return {
      httpStatusCode: '200',
      message: 'successfully logged out',
      status: 'success',
    }
  }
}
