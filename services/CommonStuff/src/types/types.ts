export type new_object = {
    "new_id": string,
    "new_link": string,
    "new_title": string,
    "new_desc": string,
    "new_img": string,
    "new_type": string,
    "new_date": string,
    "new_source": string,
    "new_isTrue": number,
    "new_isFalse": number,
    "new_isUnclear": number,
    "new_noOpinion": number,
    "new_votedIps": string[],
    "created_at"?: string,
    "updated_at"?: string
}
export type fromRequestJsonFileFormat = {
    "data": new_object[]
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
    ip: string, 
    username: {[key: string]: string}, 
    votes: {"true":number, "false": number, "unclear": number, "noopinion": number}, 
    chatMessages: number, 
    createdAt: string, 
    block: {status: true | false, time: string | undefined}
}