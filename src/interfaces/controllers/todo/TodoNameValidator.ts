import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function IsCorrectLength(min: number, max: number, validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isCorrectLength',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [min, max],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [min, max] = args.constraints;
          return typeof value === 'string' && value.length >= min && value.length <= max;
        },
      },
    });
  };
}
