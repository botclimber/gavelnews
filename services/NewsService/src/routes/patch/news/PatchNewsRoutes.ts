import express, { Request, Response } from 'express';
import { jsonData } from '../../../utils/JsonDataHandler';
import { opinion } from "../../../../../CommonStuff/src/types/types"

const PatchNewsRouter = express.Router();

PatchNewsRouter.patch("/:newId/:opinion", (req: Request, res: Response) => {

    const ip = req.ip
    const newId = req.params.newId
    const opinion = req.params.opinion as opinion

    jsonData.updateNewVeracity(newId, opinion, ip)
        .then(response => {

            if (response !== undefined) res.status(200).json({ "new_data": response, "allData": jsonData });
            else res.status(401).json({ "msg": "new not found in our db." })
        })
        .catch(e => { console.log(e.message); res.status(400).json({ "msg": e.message }) })
})

export default PatchNewsRouter;