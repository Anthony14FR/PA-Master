import {Locale} from "./config/app.config";

const dictionaries = {
    en: () => import("@kennelo/traductions/dist/en.json").then((module) => module.default),
    fr: () => import("@kennelo/traductions/dist/fr.json").then((module) => module.default),
    it: () => import("@kennelo/traductions/dist/it.json").then((module) => module.default),
    de: () => import("@kennelo/traductions/dist/de.json").then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => dictionaries[locale]();