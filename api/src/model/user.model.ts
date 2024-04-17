import {
  IsEmail,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import HelperService from "@src/services/helpers";
import { IsUnique } from "@src/validators/isUnique";
import { Prisma, UserRole } from "@prisma/client";
import { client } from "@src/database/prisma.client";

@ValidatorConstraint({ name: "IsValidUrl", async: false })
class IsValidUrlConstraint implements ValidatorConstraintInterface {
  validate(value: string) {
    return !value || HelperService.isValidUrl(value);
  }

  defaultMessage() {
    return "URL inválida";
  }
}

export class UserModel
  implements Prisma.UserCreateInput, Prisma.UserUpdateInput
{
  @IsEmpty({ message: "não é possivel setar valor no id" })
  id!: string;

  @MaxLength(50, {
    message: "O campo [usuário] deve ter no máximo 50 caracteres.",
  })
  @IsNotEmpty({ message: "O campo [usuário] é obrigatório." })
  user_name!: string;

  @IsEmail({}, { message: "O campo [email] deve ser um email válido." })
  @IsUnique(client.user, { message: "O [email] já está sendo utilizado." })
  @MaxLength(254, {
    message: "O campo [email] deve ter no máximo 254 caracteres.",
  })
  user_email!: string;

  @MaxLength(60)
  @IsOptional()
  user_password!: string;

  @IsEnum(UserRole, {
    message: "Valor inválido para o campo [papel do usuário].",
  })
  user_role!: UserRole;

  @IsOptional()
  @Validate(IsValidUrlConstraint, {
    message: "O campo [imagem do perfil] contem uma url inválida.",
  })
  @MaxLength(254, {
    message: "O campo [imagem do perfil] deve ter no máximo 254 caracteres.",
  })
  avatar_url?: string;
}
