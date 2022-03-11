import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {validator, schema, rules } from '@ioc:Adonis/Core/Validator'
import Profile from 'App/Models/Profile'

export default class ProfilesController {
  public async create({ request }: HttpContextContract) {
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
    return profile;
  }

  public async show({request ,params}: HttpContextContract) {
    const ProfileSchema = schema.create({
      id: schema.string({ trim: true }),

    })
    const data = await request.validate({ schema: ProfileSchema,data:{id:params.id} })
    const profileSchema = await Profile.findByOrFail('id', data.id)
    return profileSchema;
  }

  public async update({ request, response }: HttpContextContract) {
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
    const profileSchema = await Profile.findByOrFail('email', data.email)
    profileSchema.merge({ ...request.body() })
    try {
      await profileSchema.save()
    } catch (e) {
      return response
        .status(403)
        .json({ httpStatusCode: '403', message: 'please verify the ', status: 'failed' })
    }
  }

  public async destroy({ request }: HttpContextContract) {
    const ProfileSchema = schema.create({
      email: schema.string({ trim: true }, [
        rules.email(),
        rules.unique({ table: 'profile', column: 'email', caseInsensitive: true }),
      ]),

    })
    const data = await request.validate({ schema: ProfileSchema })
    const profileSchema = await Profile.findByOrFail('email', data.email)
    if (profileSchema) {
      try {
        await profileSchema.delete()
      } catch (e) {
        return { httpStatusCode: '403', message: 'something went wrong ', status: 'failed' }
      }
    }
  }
}
