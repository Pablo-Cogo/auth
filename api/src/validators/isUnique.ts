import { Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from "class-validator";

export function IsUnique(
  entity: Prisma.UserDelegate<DefaultArgs>,
  validationOptions?: ValidationOptions
) {
  return function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      name: "isUnique",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        async validate(value: any, args: ValidationArguments) {
          const [existingEntity] = await entity.findMany({
            where: { [propertyName]: value },
          });

          if (existingEntity) {
            return false;
          }

          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} já está em uso, escolha outro.`;
        },
      },
    });
  };
}
