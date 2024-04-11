import { UserIdentifier, UserInfo } from "../../../CommonStuff/src/types/types";

declare global {
    namespace Express {
        interface Request {
            userIdentifier: UserIdentifier | undefined;
            userInfo: UserInfo | undefined;
        }
    }
}