import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel } from '@ioc:Adonis/Lucid/Orm'

export default class Profile extends BaseModel {
  public static table = 'profiles'
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public mobile: string

  @column()
  public birthDate: DateTime

  @column()
  public gender: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashemail(profile: Profile) {
    if (profile.$dirty.email) {
      profile.email = await Hash.make(profile.email)
    }
  }
}
