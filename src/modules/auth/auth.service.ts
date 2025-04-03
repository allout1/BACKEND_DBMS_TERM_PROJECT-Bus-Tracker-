import { setResponse } from "../../handler/responsehandler";
import { eErrorMessage } from "../../interfaces/error_message.enum";
import { serviceResponse } from "../../interfaces/response.types";
import { eStatusCode } from "../../interfaces/status_code.enum";
import { iValidationService } from "../../services/iValidationService";
import { iUser, iUserSignup } from "./auth.interface";
import { iAuthService } from "./iAuthService";
import { iJwtService } from "../../services/iJwtService";
import { comparePassword, hashPassword } from "../../services/bcrypt.service";
import { User } from "../../models/user.model";


export class AuthService implements iAuthService {
    private readonly validatorService: iValidationService;
    private readonly jwtService: iJwtService;

    constructor(validatorService: iValidationService, jwtService: iJwtService) {
        this.validatorService = validatorService;
        this.jwtService = jwtService
    }

    async getUserByEmail(
        email: string
    ): Promise<serviceResponse> {
        let response: serviceResponse = {
            statusCode: eStatusCode.BAD_REQUEST,
            isError: true,
            message: "failed to get users by email",
        }
        try {
            // validations
            try {
                this.validatorService.validEmail("Email", email);
            } catch (error: any) {
                response = setResponse(response, eStatusCode.BAD_REQUEST, true, error);
                return response;
            }

            // get user by email
            const user = await User.findOne({ email: email });

            // check if the citizen exists
            if (!user) {
                response = setResponse(response, eStatusCode.OK, false, "Users not found with given email. Please register",[]);
                return response;
            }

            const result : iUser = {
                username: user.username,
                email: user.email,
                id: user._id.toString(),
                role: user.role
            }

            response = setResponse(response, eStatusCode.OK, false,"Users found successfully", result);
            return response;
        } catch (error) {
            console.log("error: ", error);
            return response;
        }
    }

    async register(
        user: iUserSignup
    ): Promise<serviceResponse>{
        let response: serviceResponse = {
            statusCode: eStatusCode.BAD_REQUEST,
            isError: true,
            message: "failed to register user",
        }
        try {
            // validations
            try {
                this.validatorService.validEmail("Email",user.email);
                this.validatorService.validPassword("Password",user.password);
                this.validatorService.validRole("Role",user.role);
                this.validatorService.validName("Name",user.username);

            } catch (error:any) {
                response = setResponse(response, eStatusCode.BAD_REQUEST, true, error);
                return response;
            }

            // check if the user is already registered
            const existingUser = await User.findOne({email:user.email})
            if(existingUser){
                response = setResponse(response, eStatusCode.BAD_REQUEST, true, "User already registered");
                return response;
            }

            // check if the passwords match
            if(user.password !== user.confirm_password){
                response = setResponse(response, eStatusCode.BAD_REQUEST, true, "The passwords do not match");
                return response;
            }

            const hashedPassword = await hashPassword(user.password)

            // create new user
            const newUser = await User.create({
                email: user.email,
                password: hashedPassword,
                role: user.role,
                username: user.username
            })
            
            // check if the user was created
            if(!newUser){
                response = setResponse(response, eStatusCode.INTERNAL_SERVER_ERROR, true, "User not created");
                return response;
            }

            response = setResponse(response,eStatusCode.OK,false,"User registered successfully");
            return response;
        } catch (error) {
            console.log("error: ",error);            
            response = setResponse(response, eStatusCode.BAD_REQUEST, true, eErrorMessage.ServerError);
            return response;
        }
    }

    async login(
        email: string,
        password: string
    ): Promise<serviceResponse> {
        let response: serviceResponse = {
            statusCode: eStatusCode.BAD_REQUEST,
            isError: true,
            message: "failed to login",
        }
        try {
            // validations
            try {
                this.validatorService.validEmail("Email", email);
                this.validatorService.validPassword("Password", password);
            } catch (error: any) {
                response = setResponse(response, eStatusCode.BAD_REQUEST, true, error);
                return response;
            }

            // check if the user exists
            const user = await User.findOne({email:email})
            if (!user) {
                response = setResponse(response, eStatusCode.BAD_REQUEST, true, "User not found");
                return response;
            }


            // check if the password matches
            const passwordMatch = await comparePassword(password,user.password);
            if(!passwordMatch){
                response = setResponse(response, eStatusCode.BAD_REQUEST, true, "Invalid password");
                return response;
            }

            const myUser: iUser = {
                username: user.username,
                id: user._id.toString(),
                role: user.role,
                email: user.email
            }

            // generate jwt
            const access_token = this.jwtService.generateAccessToken(myUser);

            const result = {
                access_token: access_token,
                user: myUser
            }

            response = setResponse(response, eStatusCode.OK, false,"User logged in successfully", result);
            return response;
        } catch (error) {
            console.log("error: ", error);
            response = setResponse(response, eStatusCode.BAD_REQUEST, true, `${error}`);
            return response;
        }
    }

    async signOut(
        user: iUser
    ): Promise<serviceResponse>{
        let response: serviceResponse = {
            statusCode: eStatusCode.BAD_REQUEST,
            isError: true,
            message: "failed to signout user",
        }
        try {

            const cookie_data = [
                {
                    name: "access_token",
                }
            ]

            response = setResponse(response,eStatusCode.OK,false,"User Logged out Successfully",{},cookie_data);
            return response;
        } catch (error) {
            console.log("error: ",error);            
            response = setResponse(response, eStatusCode.BAD_REQUEST, true, eErrorMessage.ServerError);
            return response;
        }
    }


}