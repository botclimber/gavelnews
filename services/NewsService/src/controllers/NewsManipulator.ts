import {fromRequestJsonFileFormat, new_object, opinion} from "../../../CommonStuff/src/types/types"
import * as eva from "eva-functional-utils"

export class NewsManipulator {
    data: fromRequestJsonFileFormat

    constructor(dataFromFile: fromRequestJsonFileFormat){
        this.data = dataFromFile
    }

    async updateNewVeracity(newId: string, op: opinion, ip: string | undefined ): Promise<new_object | undefined>{

        try{
            
            var new_object = undefined

            for (let x in this.data.data){
                if(this.data.data[x].new_id == newId){
                    
                    // check if ip is included
                    if(ip !== undefined && !this.data.data[x].new_votedIps.includes(ip)){

                        this.data.data[x][op] += 1;
                        this.data.data[x].new_votedIps.push(ip);
                        new_object = this.data.data[x]

                    }else throw Error(`User already voted for the specified New (${newId})!`)
                }
            }

            return new_object

        }catch(e) { if(e instanceof Error) console.log(e.message); throw e;}
    }

    dataSize(): number {
        return Buffer.byteLength(JSON.stringify(this.data), 'utf8') / (1024 * 1024);
    }

    /**
     * purpose is for the news to be mixed (ASC)
     */
    sortByTitle(): void {
        this.data.data = this.data.data.sort( (a, b) => {
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
}