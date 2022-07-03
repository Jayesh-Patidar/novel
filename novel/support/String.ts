export {};

declare global {
    interface String {
        /**
          * Strip whitespace (or other characters) from the beginning and end of a string.
          * @param characters [optional]

            You can also specify the characters you want to strip, by means of the charlist parameter. Simply list all characters that you want to be stripped. With .. you can specify a range of characters.
            
          */
        trim(characters?: string | RegExp): string;

        /**
          * Strip whitespace (or other characters) from the end of a string.
          * @param characters [optional]

            You can also specify the characters you want to strip, by means of the charlist parameter. Simply list all characters that you want to be stripped. With .. you can specify a range of characters.
          */
        trimEnd(characters?: string | RegExp): string;

        /**
          * Strip whitespace (or other characters) from the beginning of a string.
          * @param characters [optional]

            You can also specify the characters you want to strip, by means of the charlist parameter. Simply list all characters that you want to be stripped. With .. you can specify a range of characters.
            
          */
        trimStart(characters?: string | RegExp): string;
    }
}

Object.defineProperty(String.prototype, "trim", {
    value: function (
        characters: string | RegExp = " |\t|\n|\r|\0|\x0B"
    ): string {
        const regex = new RegExp(`^(${characters})+|(${characters})+$`, "g");
        return this.replace(regex, "");
    },
    enumerable: false,
});

Object.defineProperty(String.prototype, "trimEnd", {
    value: function (
        characters: string | RegExp = " |\t|\n|\r|\0|\x0B"
    ): string {
        const regex = new RegExp(`(${characters})+$`);
        return this.replace(regex, "");
    },
    enumerable: false,
});

Object.defineProperty(String.prototype, "trimStart", {
    value: function (
        characters: string | RegExp = " |\t|\n|\r|\0|\x0B"
    ): string {
        const regex = new RegExp(`^(${characters})+`);
        return this.replace(regex, "");
    },
    enumerable: false,
});
