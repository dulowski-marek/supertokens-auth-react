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
import sessionSdk from "supertokens-website/lib/build/fetch";
import AuthRecipeModule from ".";
import { SOMETHING_WENT_WRONG_ERROR } from "../../constants";
import { SuccessAPIResponse } from "../../types";

/*
 * Methods.
 */

export async function signOut<T, S, R, N>(recipe: AuthRecipeModule<T, S, R, N>): Promise<SuccessAPIResponse> {
    const sessionExpiredStatusCode = sessionSdk.sessionExpiredStatusCode;

    const result = await recipe.httpRequest.fetch(
        recipe.httpRequest.getFullUrl("/signout"),
        {
            method: "POST",
        },
        "SIGN_OUT"
    );

    if (result.status === sessionExpiredStatusCode) {
        return {
            status: "OK",
        };
    }
    if (result.status >= 300) {
        throw Error(SOMETHING_WENT_WRONG_ERROR);
    }

    return await result.json();
}
