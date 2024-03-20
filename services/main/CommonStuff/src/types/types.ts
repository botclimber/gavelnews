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
    "new_votedIps": string[],
    "created_at"?: string,
    "updated_at"?: string
}
export type fromRequestJsonFileFormat = {
    "data": new_object[]
}

export type fromScrapyJsonFileFormat = fromRequestJsonFileFormat[]