import { allUsers } from "../../../../CommonStuff/src/controllers/UsersUtils"
import { User, fromRequestJsonFileFormat, new_object, opinion, UserInfo, ResponseData, ResponseNewObject } from "../../../../CommonStuff/src/types/types"
import * as eva from "eva-functional-utils"

export class NewsManipulator {
    data: fromRequestJsonFileFormat

    constructor(dataFromFile: fromRequestJsonFileFormat) {
        this.data = dataFromFile
    }

    async updateNewVeracity(newId: string, op: opinion, userInfo: UserInfo): Promise<new_object | undefined> {

        const opinionToVote = {
            new_isTrue: "true",
            new_isFalse: "false",
            new_isUnclear: "unclear",
            new_noOpinion: "noopinion"
        }

        try {

            var new_object = undefined

            for (let x in this.data.data) {
                if (this.data.data[x].new_id == newId) {

                    // check if ip is included
                    if (!this.data.data[x].new_votedEmails.includes(userInfo.email)) {

                        this.data.data[x][op] += 1;
                        this.data.data[x].new_votedEmails.push(userInfo.email);
                        new_object = this.data.data[x]

                        await allUsers.incrementVote(opinionToVote[op] as keyof User["votes"], userInfo)

                    } else {console.log(`User already voted for the specified New (${newId})!`); return;}
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
                const isVoted = userInfo ? item.new_votedEmails.includes(userInfo.email) : undefined;
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
                    isVoted: isVoted
                };

                return responseItem;
            })
        };
        return responseData;
    }
}
