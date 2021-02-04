import { CSSObject } from "@emotion/react";
import React from "react";
import { Styles } from "../../../../types";
import { NormalisedPalette, NormalisedDefaultStyles } from "../themes/types";
declare type NormalisedStyle = {
    palette: NormalisedPalette;
    [x: string]: CSSObject;
};
declare const StyleContext: React.Context<NormalisedStyle>;
export declare function StyleProvider({ children, styleFromInit, getDefaultStyles, defaultPalette }: {
    children: JSX.Element;
    styleFromInit?: Styles;
    getDefaultStyles: (palette: NormalisedPalette) => NormalisedDefaultStyles;
    defaultPalette: NormalisedPalette;
}): JSX.Element;
export default StyleContext;
