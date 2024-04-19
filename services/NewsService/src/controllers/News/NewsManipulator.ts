import { allUsers } from "../../../../CommonStuff/src/controllers/UsersUtils"
import { User, fromRequestJsonFileFormat, new_object, opinion, UserInfo, ResponseData, ResponseNewObject, votes, voteId } from "../../../../CommonStuff/src/types/types"
import * as eva from "eva-functional-utils"

export class NewsManipulator {
    data: fromRequestJsonFileFormat

    constructor(dataFromFile: fromRequestJsonFileFormat) {
        this.data = dataFromFile
    }

    async updateNewVeracity(newId: string, op: opinion, userInfo: UserInfo): Promise< {new_id: string, new_isTrue: number, new_isUnclear: number, new_isFalse: number, vote: string, prevVote?: string} | undefined> {
        const voteToOpinion = {
            true: "new_isTrue",
            false: "new_isFalse",
            unclear: "new_isUnclear",
            noopinion: "new_noOpinion"
        }

        const opinionToVote = {
            new_isTrue: "true",
            new_isFalse: "false",
            new_isUnclear: "unclear",
            new_noOpinion: "noopinion"
        }

        const removeVote = async (vote: votes, idx: number) => {
            const keyToDecrement = voteToOpinion[vote] as opinion
            this.data.data[idx][keyToDecrement] -= 1

            this.data.data[idx].new_votedEmails = this.data.data[idx].new_votedEmails.filter( (obj: voteId) => { obj.email !== userInfo.email } )

            await allUsers.decrementVote(vote as keyof User["votes"], userInfo)
        }

        const addVote = async (vote: votes, idx: number) => {
            this.data.data[idx][op] += 1
            this.data.data[idx].new_votedEmails.push({ email: userInfo.email, vote: vote as votes });
            
            await allUsers.incrementVote(vote as keyof User["votes"], userInfo)
        }

        try {

            var new_object = undefined

            for (let x in this.data.data) {
                if (this.data.data[x].new_id == newId) {

                    const currentVote = this.getUserVote(userInfo.email, this.data.data[x].new_votedEmails)
                    const vote = opinionToVote[op]

                    if(currentVote) await removeVote(currentVote, +x)
                    await addVote(vote as votes, +x)

                    const res_newId = this.data.data[x].new_id
                    const res_new_isTrue = this.data.data[x].new_isTrue
                    const res_new_isUnclear = this.data.data[x].new_isUnclear
                    const res_new_isFalse = this.data.data[x].new_isFalse
                    new_object = {new_id: res_newId, new_isTrue:res_new_isTrue, new_isUnclear:res_new_isUnclear, new_isFalse: res_new_isFalse, vote: vote, prevVote: currentVote}

                    console.log(this.data.data[x])

                }
            }

            return new_object

        } catch (e) { console.log(e); return; }
    }

    dataSize(): number {
        return Buffer.byteLength(JSON.stringify(this.data), 'utf8') / (1024 * 1024);
    }

    /**
     * purpose is for the news to be mixed (ASC)
     */
    sortByTitle(): void {
        this.data.data = this.data.data.sort((a, b) => {
            return b.new_title.length - a.new_title.length
        })
    }

    cleanData(): void {
        this.data.data = this.data.data.map(element => {

            element.new_title = element.new_title.replaceAll("<em>", "")
            element.new_title = element.new_title.replaceAll("</em>", "")
            element.new_title = element.new_title.replaceAll("\"", "")
            element.new_title = element.new_title.replaceAll("'", "")

            return element
        })
    }

    async getData(userInfo?: UserInfo): Promise<ResponseData> {

        const responseData: ResponseData = {
            data: this.data.data.map((item: new_object) => {

                const vote = userInfo ? this.getUserVote(userInfo?.email, item.new_votedEmails) : undefined
                
                const responseItem: ResponseNewObject = {
                    new_id: item.new_id,
                    new_link: item.new_link,
                    new_title: item.new_title,
                    new_desc: item.new_desc,
                    new_img: item.new_img,
                    new_type: item.new_type,
                    new_date: item.new_date,
                    new_source: item.new_source,
                    new_isTrue: item.new_isTrue,
                    new_isFalse: item.new_isFalse,
                    new_isUnclear: item.new_isUnclear,
                    new_noOpinion: item.new_noOpinion,
                    created_at: item.created_at,
                    updated_at: item.updated_at,
                    isVoted: vote
                };

                return responseItem;
            })
        };
        return responseData;
    }

    getCategories(): Set<string> {
        const categoriesSet: Set<string> = new Set();

        // Iterate over each new_object and extract the new_type
        this.data.data.forEach((item) => {
            categoriesSet.add(item.new_type);
        });

        return categoriesSet;
    }

    getUserVote(email: string, votedEmails: new_object["new_votedEmails"]): votes | undefined {

        const vote: voteId | undefined = eva.getOrElse(undefined, votedEmails, email, "email")

        return (vote)? vote.vote : undefined

    }
}
