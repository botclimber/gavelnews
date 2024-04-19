import express, { Request, Response } from 'express';
import { jsonData } from '../../../utils/JsonDataHandler';
import { UserIdentifier, opinion } from "../../../../../CommonStuff/src/types/types"
import { allUsers } from '../../../../../CommonStuff/src/controllers/UsersUtils';

const PatchNewsRouter = express.Router();

PatchNewsRouter.patch("/:newId/:opinion", async (req: Request, res: Response) => {

    const userInfo = req.userInfo
    const userIdentifier = req.userIdentifier as UserIdentifier

    const userBlocked = await allUsers.checkRemoveExpiredBlock(userIdentifier, userInfo)
    if (userBlocked !== undefined && userBlocked.block.status) return res.status(403).json({ msg: `Sry but you are blocked. timeout until ${userBlocked.block.time}` });


    const newId = req.params.newId
    const opinion = req.params.opinion as opinion

    if (userInfo) {
        jsonData.updateNewVeracity(newId, opinion, userInfo)
            .then(async (response) => {

                if (response !== undefined) res.status(200).json({ "updatedVotes": response, "allData": await jsonData.getData(userInfo) });
                else res.status(401).json({ "msg": "new not found in our db." })
            })
            .catch(e => { console.log(e.message); res.status(400).json({ "msg": e.message }) })

    } else return res.status(403).json({ "msg": "only allowed users can vote." })
})

export default PatchNewsRouter;
