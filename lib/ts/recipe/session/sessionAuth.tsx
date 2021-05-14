/* Copyright (c) 2021, VRAI Labs and/or its affiliates. All rights reserved.
 *
 * This software is licensed under the Apache License, Version 2.0 (the
 * "License") as published by the Apache Software Foundation.
 *
 * You may not use this file except in compliance with the License. You may
 * obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

/*
 * Imports.
 */
import React, { useEffect } from "react";

import { getWindowOrThrow } from "supertokens-website/lib/build/utils";
import { FeatureBaseOptionalRidProps } from "../../types";
import AuthRecipeModule from "../authRecipeModule";
import SuperTokens from "../../superTokens";
import { isAuthRecipeModule } from "../authRecipeModule/utils";
import useSessionContext from "./useSessionContext";

type Props = FeatureBaseOptionalRidProps & {
    // False by default
    requireAuth?: boolean;
};

const getRecipeInstanceOrThrow = <T, S, R, N>(recipeId?: string): AuthRecipeModule<T, S, R, N> => {
    if (recipeId === undefined) {
        throw new Error("No recipeId props given to SessionAuth component");
    }

    const recipe = SuperTokens.getInstanceOrThrow().getRecipeOrThrow(recipeId);
    if (isAuthRecipeModule<T, S, R, N>(recipe)) {
        return recipe;
    }

    throw new Error(`${recipe.recipeId} must be an instance of AuthRecipeModule to use SessionAuth component.`);
};

const redirectToLogin = (recipeId?: string, history?: any) => {
    const redirectToPath = getWindowOrThrow().location.pathname;

    getRecipeInstanceOrThrow(recipeId).redirect(
        ({ action: "SIGN_IN_AND_UP" }),
        history,
        {
            redirectToPath,
        }
    );
};

const SessionAuth: React.FC<Props> = ({ children, ...props }) => {
    const ctx = useSessionContext();

    useEffect(() => {
        if (ctx.doesSessionExist && props.requireAuth) {
            redirectToLogin(props.recipeId, props.history);
        }
    }, [ctx]);

    return <>{children}</>;
}

export default SessionAuth;
