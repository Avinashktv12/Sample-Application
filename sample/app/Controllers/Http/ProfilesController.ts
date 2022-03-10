import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Profile from 'App/Models/profile'

export default class ProfilesController {
  public async create({ request, response }: HttpContextContract) {
    const ProfileSchema = schema.create({
      name: schema.string({ trim: true }, [rules.minLength(3), rules.maxLength(30)]),
      email: schema.string({ trim: true }, [
        rules.email(),
        rules.unique({ table: 'profile', column: 'email', caseInsensitive: true }),
      ]),
      gender: schema.string({ trim: true }),
      mobilenumber: schema.string({ trim: true }, [rules.mobile()]),
      dob: schema.date({ format: 'DD/MM/YYYY' }),
    })
    const data = await request.validate({ schema: ProfileSchema })
    const profile = await Profile.create(data)
    return response.json(profile)
  }

  public async show({ response, params }: HttpContextContract) {
    const profileSchema = await Profile.findByOrFail('email', params.email)
    return response.json(profileSchema)
  }

  public async update({ request, response }: HttpContextContract) {
    const profileSchema = await Profile.findByOrFail('email', request.body().email)
    profileSchema.merge({ ...request.body() })
    try {
      await profileSchema.save()
    } catch (e) {
      return response
        .status(403)
        .json({ httpStatusCode: '403', message: 'please verify the ', status: 'failed' })
    }
    return response.json({
      httpStatusCode: '200',
      message: 'updated successfully',
      status: 'success',
    })
  }

  public async destroy({ request, response }: HttpContextContract) {
    const profileSchema = await Profile.findByOrFail('email', request.body().email)
    if (profileSchema) {
      try {
        await profileSchema.delete()
      } catch (e) {
        return response
          .status(403)
          .json({ httpStatusCode: '403', message: 'something went wrong ', status: 'failed' })
      }
    }
    return response.json({
      httpStatusCode: '200',
      message: 'deleted successfully',
      status: 'success',
    })
  }
}
