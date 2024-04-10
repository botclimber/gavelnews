interface NewObjectBase {
    new_id: string;
    new_link: string;
    new_title: string;
    new_desc: string;
    new_img: string;
    new_type: string;
    new_date: string;
    new_source: string;
    new_isTrue: number;
    new_isFalse: number;
    new_isUnclear: number;
    new_noOpinion: number;
    created_at?: string;
    updated_at?: string;
}

// when sending response if isVoted undefined dont display vote buttons
export type ResponseNewObject = NewObjectBase & {
    isVoted?: boolean;
}

export type new_object = NewObjectBase & {
    new_votedEmails: string[];
}

export type fromRequestJsonFileFormat = {
    "data": new_object[]
}

export type ResponseData = {
    "data": ResponseNewObject[]
}

export type fromScrapyJsonFileFormat = fromRequestJsonFileFormat[]

export type opinion = "new_isTrue" | "new_isFalse" | "new_isUnclear" | "new_noOpinion"

export type ReservedUsername = { [key: string]: string }
export type message = {
    chatIcon: number,
    user: ReservedUsername,
    message: string,
    date: Date
}

export type BlockActions = "temporary" | "permanent" | "remove"
export type User = {
    userEmail?: string,
    userFullName?: string,
    userImg: string,
    userIdentifier: {ip: string, useragent: string}, 
    username: ReservedUsername, 
    votes: {"true":number, "false": number, "unclear": number, "noopinion": number}, 
    chatMessages: number, 
    createdAt: string, 
    block: {status: true | false, time: string | undefined}
}
