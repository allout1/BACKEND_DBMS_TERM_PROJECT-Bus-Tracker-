import { serviceResponse } from "../../interfaces/response.types";
import { User } from "../../models/user.model";
import { iUser, iUserSignup } from "./auth.interface";

export interface iAuthService {
    register: (
        user: iUserSignup
    ) => Promise<serviceResponse>;

    login: (
        email: string,
        password: string
    ) => Promise<serviceResponse>;

    getUserByEmail: (
        email: string
    ) => Promise<serviceResponse>;

    signOut: (
        user: iUser
    ) => Promise<serviceResponse>;

}