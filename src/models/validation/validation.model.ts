export interface SendOtpDto {
    sentTo: string;
}

export interface ValidateOtpDto {
    sentTo: string;
    code: string;
}