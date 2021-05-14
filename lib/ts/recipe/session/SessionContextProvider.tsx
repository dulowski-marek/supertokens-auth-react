import React, { useEffect, useState } from "react";
import SessionContext from "./SessionContext";
import GlobalSessionManager from "supertokens-website/lib/build/GlobalSessionManager";
import { SessionManager } from "supertokens-website/lib/build/SessionManager";
import { SessionContextType } from "./types";
import { Optional } from "supertokens-website/lib/build/Optional";
import { Session } from "supertokens-website/lib/build/Session";

type Props = {
    sessionManager?: SessionManager;
}

export const SessionContextProvider: React.FC<Props> = ({ sessionManager = GlobalSessionManager, children }) => {
    const [context, setContext] = useState<SessionContextType>({
        doesSessionExist: false,
    });

    useEffect(() =>
        sessionManager.subscribe({
            next: (session: Optional<Session>) => {
                setContext(session.map<SessionContextType>(s => ({
                    doesSessionExist: true,
                    userId: s.getUserId(),
                    jwtPayload: s.getPayload(),
                })).getOrElse({ doesSessionExist: false }));
            },
        }), [sessionManager]);

    return <SessionContext.Provider value={context}>
        {children}
    </SessionContext.Provider>
}
