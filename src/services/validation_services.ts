import { iValidationService } from "./iValidationService";

export class ValidationService implements iValidationService {

    validNumber(name: string, data: any): boolean {
        if (data ===null || data === "" || data === undefined) throw `${name} is not a valid number`
        if (isNaN(data) || !Number.isFinite(data)) {
            throw `Please enter a valid ${name}`;
        }
        return true;
    }

    validString(name: string, data: any): boolean {
        if (!data || data == null || data.trim() == "" || data == "null" || data == undefined || data=="undefined") {
            throw `Please enter a valid ${name}`;
        }

        const regex = /^[A-Za-z0-9\s.\-#*_,@%&\/'()]+$/;

        if (!regex.test(data)) {
            throw `${name} contains some special character. Please enter a valid ${name}`
        }

        return true;
    }

    validEmail(name: string, email: any): boolean {
        this.validString(name, email);
        const emailRegex =
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const valid = emailRegex.test(String(email).toLowerCase());
        if (!valid) {
            throw `${name} is invalid. Please enter a valid ${name}`;
        }
        return true;
    }

    validPassword(name: string, password: any): boolean {
        this.validString(name, password);
        const strongPwdRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        const valid = strongPwdRegex.test(String(password));
        if (!valid) {
            throw `${name} is invalid. Your password must be atleast 8 characters long, with one upper case,lower case character, one number and a special character.`;
        }
        return true;
    }

    validBoolean(
        name: string,
        data: any
    ): boolean {
        if (!(typeof data == "boolean")) {
            throw `${name} is invalid. Please enter a valid ${name}`;
        }
        return true;
    };

    validRole(
        name: string,
        data: any
    ): boolean {
        if(data != 'user' && data != 'admin' && data!='driver'){
            throw `Please enter a valid ${name}. Role can be either 'user', 'admin', or 'driver'`;
        }
        return true;
    }

    validName(name: string, data: any):boolean {
        this.validString(name, data);
        const nameRegex = /^[A-Za-z .]+$/;
        const valid = nameRegex.test(data);
        if (!valid) {
            throw `${name} is invalid. Please enter a valid ${name}. Name can contain alphabets, spaces and dots only.`;
        }
        return true;
    }

    validDate(name: string, data: any): boolean {
        if(data == null || data == "" || data == undefined) throw `${name} is not a valid date`
        const date = new Date(data);
        if(isNaN(date.getDate())){
            throw `Please enter a valid ${name}`;
        }
        return true;
    }

    validOtp(name: string, data: any): boolean {
        // otp is of length exactly 6
        const regex = /^[0-9]{6}$/;
        const valid = regex.test(data);
        if (!valid) {
            throw `${name} is invalid. Please enter a valid ${name}`;
        }    
        return true;
    }
    validGender(name: string, data: any) :boolean{
        if(data == null || data == "" || data == undefined) {
            throw `${name} is invalid. Please enter a valid ${name}`;
        }
        if(data != 'male' && data != 'female' && data !='non-binary'){
            throw `${name} is invalid. Please enter a valid ${name}`;
        }
        return true;
        
    }
}