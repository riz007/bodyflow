import type { Locale } from "../config";
import { bn } from "./bn";
import { de } from "./de";
import { en, type Dict } from "./en";
import { es } from "./es";
import { fr } from "./fr";
import { ja } from "./ja";
import { ko } from "./ko";
import { ru } from "./ru";
import { th } from "./th";
import { zh } from "./zh";

const DICTS: Record<Locale, Dict> = { en, es, zh, ko, ja, fr, de, th, bn, ru };

/** Server-side lookup. Client components get their dictionary through <I18nProvider>. */
export const getDict = (l: Locale): Dict => DICTS[l];

export { tf, type Dict } from "./en";
