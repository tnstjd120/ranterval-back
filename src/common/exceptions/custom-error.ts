import { CustomErrorCode } from "./custom-error-code.enum";

export class CustomError {
    constructor(
      public code: CustomErrorCode,
      public message?: string,
    ) {}
  }