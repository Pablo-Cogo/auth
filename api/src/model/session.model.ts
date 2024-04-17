import { IsEmpty, IsNotEmpty, IsNumber } from "class-validator";
import { Prisma } from "@prisma/client";

export class SessionModel
  implements Prisma.SessionCreateInput, Prisma.SessionUpdateInput
{
  @IsEmpty({ message: "não é possivel setar valor no id" })
  id!: string;

  @IsNotEmpty()
  token!: string;

  @IsNumber()
  @IsNotEmpty()
  expires_in!: number;

  @IsNotEmpty()
  ip_address!: string;

  @IsNotEmpty()
  device!: string;

  @IsNotEmpty()
  country!: string;

  @IsNotEmpty()
  city!: string;

  @IsNotEmpty()
  user!:
    | Prisma.UserCreateNestedOneWithoutSessionInput
    | Prisma.UserUpdateOneRequiredWithoutSessionNestedInput;
}
