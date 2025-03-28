export interface iValidationService {
    validNumber: (name: string,data: any) => boolean;
    validEmail: (name: string, email: string) => boolean;
    validString: (name: string, data: any) => boolean;
    validPassword: (name: string, data: any) => boolean;
    validBoolean: (name: string, data: any) => boolean ;
    validRole:(name: string, data: any) => boolean;
    validName:(name: string, data: any) => boolean;
    validDate:(name: string, data: any) => boolean;
    validOtp:(name: string, data: any) => boolean;
    validGender:(name: string, data: any) => boolean;
}