export type ServerConfig = {
  useHTTPS: boolean,
  certPath?: string,
  keyPath?: string
}

export type votes = "true" | "unclear" | "false"

export type voteId = {
    email: string,
    vote: votes
}

export interface NewObjectBase {
    new_id: string;
    new_link: string;
    new_title: string;
    new_desc: string;
    new_img: string;
    new_type: string;
    new_date: string;
    new_source: string;
    created_at?: string;
    updated_at?: string;
}

export type new_object = NewObjectBase & {
    new_isTrue: number,
    new_isFalse: number,
    new_isUnclear: number,
    visible: boolean,
    new_votedEmails: voteId[]
}

export type fromRequestJsonFileFormat = {
    "data": new_object[]
}

// when sending response if isVoted undefined dont display vote buttons
export type ResponseNewObject = Omit<new_object, "new_votedEmails"> & {
    isVoted?: votes
}

export type ResponseData = {
    "data": ResponseNewObject[]
}

export type fromScrapyJsonFileFormat = fromRequestJsonFileFormat[]

export type opinion = "new_isTrue" | "new_isFalse" | "new_isUnclear"

export type ReservedUsername = { [key: string]: string }
export type message = {
    userImg?: string, // its added when handling message
    username?: string, // its added when handling message
    token?: string, // to be removed before broadcast
    userType: string // its added when handling message
    icon: number,
    usernameId: ReservedUsername, // hide key before broadcast
    message: string,
    date: Date
}

export type BlockActions = "temporary" | "permanent" | "remove"

export type UserIdentifier = {
    ip: string,
    userAgent: string
}

export type UserInfo = {
    email: string,
    fullName: string,
    img: string
}

export type User = {
    userInfo?: UserInfo,
    userIdentifier: UserIdentifier, 
    usernameId: ReservedUsername, 
    votes: {"true":number, "false": number, "unclear": number, "noopinion": number}, 
    chatMessages: number, 
    createdAt: string, 
    block: {status: true | false, time: string | undefined}
}
