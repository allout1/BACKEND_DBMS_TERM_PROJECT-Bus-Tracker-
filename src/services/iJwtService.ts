// import { iUser } from "../modules/auth/auth.interface";

export interface signedTokenObj {
	access_token: string,
	// refresh_token: string
}

export interface iJwtService {
	generateAccessToken: (payload: any) => any;
	// verifyToken: (accessToken: string,secret?: string) => (iUser | null );
	// generateRefreshToken: (payload: any) => any;
}