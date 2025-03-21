import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { DateTime } from 'luxon';
import { timezoneConfig } from 'src/infrastructure/config/timezone.config';

export type BlockDocument = HydratedDocument<Block>;

export enum BlockStyle {
  JOB = 'trabajo',
  REST = 'descanso',
  MEAL = 'comida',
  MEETING = 'reunión',
  OTHER = 'otro',
}

@Schema()
export class Block {
  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: true })
  endTime: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  attachedUser: User;

  @Prop({ type: String, enum: BlockStyle, default: BlockStyle.OTHER })
  style: BlockStyle;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  startTimeStr: string;
}

export const BlockSchema = SchemaFactory.createForClass(Block);

/*
  Middleware para ajustar las fechas de inicio y fin antes de guardar
*/
BlockSchema.pre('save', function (next) {
  if (!this.startTime || !this.endTime) {
    return next(new Error('startTime and endTime are required fields'));
  }

  try {
    // Convertir a DateTime dependiendo del tipo de dato
    const convertToDateTimeWithZone = (dateValue) => {
      let dateTime;
      if (dateValue instanceof Date) {
        dateTime = DateTime.fromJSDate(dateValue).setZone(timezoneConfig.timezone);
      } else if (typeof dateValue === 'string') {
        dateTime = DateTime.fromISO(dateValue).setZone(timezoneConfig.timezone);
      } else {
        throw new Error('Invalid date format');
      }

      // Compensar la diferencia de 5 horas que MongoDB añade
      // Restamos 5 horas para que cuando MongoDB las añada, quede la hora correcta
      return dateTime.minus({ hours: 5 });
    };

    // Aplicar conversión a ambas fechas
    const startDateTime = convertToDateTimeWithZone(this.startTime);
    const endDateTime = convertToDateTimeWithZone(this.endTime);

    // Verificar que las fechas son válidas
    if (!startDateTime.isValid || !endDateTime.isValid) {
      return next(new Error('Invalid date format for startTime or endTime'));
    }

    // Guardar las fechas convertidas
    this.startTime = startDateTime.toISO();
    this.endTime = endDateTime.toISO();

    next();
  } catch (error) {
    console.error('Error processing dates:', error);
    next(error);
  }
});