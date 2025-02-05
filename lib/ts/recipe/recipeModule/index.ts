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
import HttpRequest from "../../httpRequest";
import { NormalisedAppInfo, RecipeFeatureComponentMap } from "../../types";

import { appendQueryParamsToURL, getWindowOrThrow, normalisedRecipeModuleHooks } from "../../utils";
import { NormalisedRecipeModuleHooks, RecipeModuleConfig } from "./types";
import NormalisedURLDomain from "../../normalisedURLDomain";

/*
 * Class.
 */
export default abstract class RecipeModule<T, S, R> {
    /*
     * Instance attributes.
     */

    recipeId: string;
    appInfo: NormalisedAppInfo;
    httpRequest: HttpRequest<T, S, R>;
    hooks: NormalisedRecipeModuleHooks<T, S, R>;

    /*
     * Constructor.
     */
    constructor(config: RecipeModuleConfig<T, S, R>) {
        this.recipeId = config.recipeId;
        this.appInfo = config.appInfo;
        this.httpRequest = new HttpRequest(this);
        this.hooks = normalisedRecipeModuleHooks(config);
    }

    redirect = async (context: T, history?: any, queryParams?: Record<string, string>): Promise<void> => {
        let redirectUrl = await this.getRedirectUrl(context);
        redirectUrl = appendQueryParamsToURL(redirectUrl, queryParams);

        try {
            new URL(redirectUrl); // If full URL, no error thrown, skip in app redirection.
        } catch (e) {
            // For multi tenancy, If mismatch between websiteDomain and current location, prepand URL relative path with websiteDomain.
            const origin = new NormalisedURLDomain(getWindowOrThrow().location.origin).getAsStringDangerous();
            if (origin !== this.appInfo.websiteDomain.getAsStringDangerous()) {
                redirectUrl = `${this.appInfo.websiteDomain.getAsStringDangerous()}${redirectUrl}`;
                getWindowOrThrow().location.href = redirectUrl;
                return;
            }

            // If history was provided, use to redirect without reloading.
            if (history !== undefined) {
                history.push(redirectUrl);
                return;
            }
        }
        // Otherwise, redirect in app.
        getWindowOrThrow().location.href = redirectUrl;
    };

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    getRedirectUrl = async (context: T): Promise<string> => {
        // If getRedirectionURL provided by user.
        const redirectUrl = await this.hooks.getRedirectionURL(context);
        if (redirectUrl !== undefined) {
            return redirectUrl;
        }

        // Otherwise, use default.
        return await this.getDefaultRedirectionURL(context);
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async getDefaultRedirectionURL(_: T): Promise<string> {
        throw new Error("getDefaultRedirectionURL is not implemented.");
    }

    abstract getFeatures(): RecipeFeatureComponentMap;
}
