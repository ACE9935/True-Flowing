export interface ClientInfos {
    submitDate: string
    name:string
    email:string
    phoneNumber:string
}

export type AutomateType = "3-day" | "1-week" | "1-month" | "3-month";

export interface ClientPhoneNumberOrEmail {
    content:string
    stopToken:string
}

export interface AutomatedNotification {
    id:string
    every:AutomateType
    scheduledDate:string
    type:"Email" | "SMS"
    activated:boolean
    content:EmailInterface | SMSInterface 
}

export interface EmailInterface {
    sender: string
    subject: string
    email: string
 }

 export interface SMSInterface {
    sender:string
    sms:string
 }

export interface User {
    id:string
    verificationToken?:string
    resetPasswordToken?:string
    qrCodes:UserQRCode[]
    clientPhoneNumbers:ClientPhoneNumberOrEmail[]
    clientEmails:ClientPhoneNumberOrEmail[]
    clients:Client[]
    photoUrl:string
    emailVerified:boolean
    name:string
    userName:string
    phone?:string | null
    email:string
    acceptPlcs:boolean
    automatedNotifications: AutomatedNotification[]
}

export interface InitialUser{
    name:string
    userName:string
    phone:string
    email:string
    acceptPlcs:boolean
    pwd:string
    rePwd:string
}

export interface SignUpErrors {
    error: Omit<InitialUser, "acceptPlcs"> & { acceptPlcs: string }
}

export interface SignUpResponse {
   method?:"credentials" | "google"
   errors:SignUpErrors | null
   status:"ERROR" | "OK" | null
}

export interface LoginResponse {
    // Indique les erreurs rencontrées lors de la tentative de connexion.
    errorMsg: "Veuillez vérifier votre email pour vous connecter" | "Une erreur est survenue, veuillez réessayer ultérieurement" | "Utilisateur introuvable. Veuillez vérifier votre email et mot de passe"| "Veuillez fournir une adresse e-mail valide" | string |null ;
    // Indique le statut de la réponse.
    status: "ERROR" | "OK" | null;
 }

 export interface PwdResetResponse {
    // Indique les erreurs rencontrées lors de la tentative de connexion.
    errorMsg: "Une erreur est survenue, veuillez réessayer ultérieurement" | "Utilisateur introuvable. Veuillez vérifier votre email"| "Veuillez fournir une adresse e-mail valide" | null;
    // Indique le statut de la réponse.
    status: "ERROR" | "OK" | null;
 }

 export interface PwdResetSecondResponse {
    // Indique les erreurs rencontrées lors de la tentative de connexion.
    errors: {pwd:string,rePwd:string} | null;
    // Indique le statut de la réponse.
    status: "ERROR" | "OK" | null;
 }

 export interface QRCode {
    name:string,
    type:"Basic" | "Premium"
    redirectoryLink:string
    correctionLevel:"L" | "M" | "Q" | "H"
    darkColor:string,
    lightColor:string,
    text:string,
    margin:number,
    meta?:{
        logoImg?:File
        desktopImg?:File
        introductoryText:string
        reviewLinks:ReviewLinks
        spinWheelData:{
            bgColors:string[],
            textColor:string[],
            options:SpinWheelOption[]
    }
}}

export interface SpinWheelOption {
    option:string,
    size:number,
}

export interface ReviewLinks {
    google?: string;
    facebook?: string
  }

  export interface UserBasicQRCode {
    url:string
    id:string
    name:string
    redirectoryLink?:string
    type:"Basic" | "Premium"
    scansPerDay:number
    scansPerWeek:number
    scansPerMonth:number
    scansForDate:{date:string,scans:number}[]
    scans:number
}

export interface UserQRCode {
    url:string
    id:string
    name:string
    redirectoryLink?:string
    type:"Basic" | "Premium"
    winners:number
    winnersPerDay:number
    winnersPerWeek:number
    winnersPerMonth:number
    winnersForDate:{date:string,winners:number}[]
    scansPerDay:number
    scansPerWeek:number
    scansPerMonth:number
    scansForDate:{date:string,scans:number}[]
    scans:number
    meta:{
        logoImg:string 
        desktopImg:string 
        introductoryText:string
        reviewLinks:ReviewLinks
        spinWheelData:{
            bgColors:string[],
            textColor:string[],
            options:SpinWheelOption[]
    }
    }
}

export interface Client {
    stopToken?:string
    infos:ClientInfos
}

export interface ClientPageState {
   providerId:string | null
   client:Client
   qrCode:UserQRCode | null
}