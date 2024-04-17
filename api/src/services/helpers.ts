import { ErroException } from "@src/exceptions/ErroException";
import * as crypto from "crypto";
import dayjs, { ManipulateType } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

export default class HelperService {
  public static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  }

  public static isJson(str: string): boolean {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }

  public static generateApiKey(): void {
    const apiKey = crypto.randomBytes(32).toString("hex");
    console.log("API Key gerada:", apiKey);
  }

  public static convertTimeToDaysJs(value: string): dayjs.Dayjs {
    const match = value.match(/(\d+)(.*?)$/);

    if (match) {
      const num: number = parseInt(match[1]);
      const type: string = match[2];

      return dayjs().add(num, type as ManipulateType);
    } else {
      throw new ErroException(
        "Erro interno: falha ao realizar a conversão de datas."
      );
    }
  }

  public static convertStringToDaysJs(
    dateString: string,
    format: string = "DD/MM/YYYY HH:mm:ss"
  ): dayjs.Dayjs {
    dayjs.extend(customParseFormat);
    return dayjs(dateString, format);
  }
}
