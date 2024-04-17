"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const fs = __importStar(require("fs/promises"));
class EnumProcessor {
    constructor({ enumsFilePath, prismaFilePath, }) {
        this.schemaPath = "prisma/schema.prisma";
        this.prismaFilePath = prismaFilePath;
        this.enumsFilePath = enumsFilePath;
    }
    async generateEnumsFile() {
        try {
            const data = await fs.readFile(this.schemaPath, "utf8");
            const enumRegex = /enum\s+(\w+)\s+\{([\s\S]+?)\}/g;
            let match;
            let allEnumsOutput = "";
            while ((match = enumRegex.exec(data)) !== null) {
                const enumName = match[1];
                const enumBody = match[2];
                const enumItemRegex = /(\w+)\s+@map\((.+)\)/g;
                let enumItems = "";
                let itemMatch;
                while ((itemMatch = enumItemRegex.exec(enumBody)) !== null) {
                    const itemName = itemMatch[1];
                    const itemValue = itemMatch[2].trim();
                    enumItems += `  ${itemName} = ${itemValue},\n`;
                }
                const enumOutput = `export enum ${enumName} {\n${enumItems}}\n\n`;
                allEnumsOutput += enumOutput;
            }
            const absolutePath = path.resolve(__dirname, this.enumsFilePath);
            await fs.writeFile(absolutePath, allEnumsOutput, "utf8");
            console.log(`Generated ${absolutePath}`);
        }
        catch (err) {
            console.error("Error processing enums file:", err);
        }
    }
    processEnums() {
        const absolutePath = path.resolve(__dirname, this.enumsFilePath);
        const enums = require(absolutePath);
        const enumsPairs = [];
        function formatEnumAsString(enumName, enumObject) {
            const keysAndValues = Object.entries(enumObject)
                .map(([key, value]) => `${key}: '${value}'`)
                .join(",\n  ");
            return `export const ${enumName}: {\n  ${keysAndValues}\n};\n`;
        }
        for (const enumName in enums) {
            if (Object.prototype.hasOwnProperty.call(enums, enumName)) {
                const enumObject = enums[enumName];
                if (typeof enumObject === "object" &&
                    !Array.isArray(enumObject) &&
                    Object.keys(enumObject).length > 0) {
                    const enumString = formatEnumAsString(enumName, enumObject);
                    enumsPairs.push([enumName, enumString]);
                }
            }
        }
        return enumsPairs;
    }
    async getConstantText(constantName) {
        const absolutePath = path.resolve(__dirname, this.prismaFilePath);
        const fileContent = await fs.readFile(absolutePath, "utf-8");
        const regex = new RegExp(`export const ${constantName}: {[\\s\\S]*?};`);
        const match = regex.exec(fileContent);
        if (match) {
            return match[0];
        }
        else {
            console.error(`Constant ${constantName} not found.`);
            return "";
        }
    }
    async replaceTextInFile(searchText, replaceText) {
        const absolutePath = path.resolve(__dirname, this.prismaFilePath);
        let fileContent = await fs.readFile(absolutePath, "utf-8");
        if (fileContent.includes(searchText)) {
            fileContent = fileContent.replace(searchText, replaceText);
            await fs.writeFile(absolutePath, fileContent);
        }
        else {
            console.error(`Text '${searchText}' not found in the file.`);
        }
    }
    async processAndReplaceEnums() {
        await this.generateEnumsFile();
        const enumsPairs = this.processEnums();
        for (const [enumName, enumString] of enumsPairs) {
            const constCurrentText = await this.getConstantText(enumName);
            await this.replaceTextInFile(constCurrentText, enumString);
        }
        console.log("Enums successfully updated in the Prisma file");
    }
}
new EnumProcessor({
    enumsFilePath: "../enums.ts",
    prismaFilePath: "./../../../node_modules/.prisma/client/index.d.ts",
}).processAndReplaceEnums();
//# sourceMappingURL=replace-enum-values.js.map