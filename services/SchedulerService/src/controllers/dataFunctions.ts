import { new_object, NewObjectBase } from "../../../CommonStuff/src/types/types";

export async function additionalFields(mergedData: NewObjectBase[]): Promise<new_object[]> {
    return mergedData.map(obj => {
        return {
            ...obj,
            new_isTrue: 0,
            new_isFalse: 0,
            new_isUnclear: 0,
            visible: true,
            new_votedEmails: []
        }
    })
}

// TODO: check if there are repeated news from previous days