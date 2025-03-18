import jwt, { Jwt, JwtPayload } from 'jsonwebtoken'
import { iJwtService, signedTokenObj } from "./iJwtService";
import { iUser } from '../modules/auth/auth.interface';
import { ENV_ACCESS_TOKEN_EXPIRY, ENV_ACCESS_TOKEN_SECRET } from '../../secret';

const accessToken = `${ENV_ACCESS_TOKEN_SECRET}`
const accessTokenTime = `${ENV_ACCESS_TOKEN_EXPIRY}`

class JWTService implements iJwtService{
    private access_token_secret: string;
    private access_token_time: any;

    constructor(
        access_token_secret: string,
        access_token_time: string,
    ) {
        this.access_token_secret = access_token_secret;
        this.access_token_time = access_token_time;
    }

    generateAccessToken(payload: iUser){
        try {
            const token= jwt.sign (
                {
                    payload
                },
                this.access_token_secret,
                {
                    expiresIn: this.access_token_time,
                }
            )
            return token;
        } catch (error) {
            console.log("Error in generating access token: ",error);
            throw error;
        }
    }

    verifyToken(accessToken: string,secret: string = this.access_token_secret): iUser | null {
        try {
            const decoded = jwt.verify(accessToken,secret) as JwtPayload;
            if(!decoded)throw `Invalid token`;
            console.log("em",decoded.payload.email);

            const userObject: iUser = {
                email: decoded.payload.email,
                citizen_id: decoded.payload.citizen_id,
                role: decoded.payload.role
            };
            console.log("userObbbbject", userObject);
            return userObject;
        } catch (error) {
            throw error;
        }
    };
}

export default new JWTService(accessToken, accessTokenTime);