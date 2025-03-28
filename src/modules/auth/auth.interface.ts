export interface iUserSignup {
    email: string,
    password: string,
    confirm_password: string,
    username: string,
    role: string
}

export interface iUser {
    id: string,
    email: string,
    username: string,
    role: string,
    socket_id?: string 
}