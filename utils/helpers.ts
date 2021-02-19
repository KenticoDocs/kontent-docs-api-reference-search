import {
    ICallout,
    ICodeSample,
    IItemRecordsBlob,
    IPreprocessedData,
    IRecord,
    ISystemAttributes,
    IZapiSpecification,
    Section,
} from 'kontent-docs-shared-code';
import {
    HTMLElement,
    parse,
} from 'node-html-parser';
import * as striptags from 'striptags';
import { IGenericItems } from '../kcd-api-reference-search-update';
import { ApiReferenceProcessor } from './ApiReferenceProcessor';

export const isCodeSample = (contentType: string): boolean => {
    if (contentType === 'code_sample') {
        return true;
    }
    return false;
}

export const getChildCodenamesFromRichText = (content: string): string[] => {
    const root = parse(content) as HTMLElement;
    const richTextParagraphs = root.querySelectorAll('p');

    return richTextParagraphs
        .filter((paragraph: any) =>
            paragraph.rawAttributes.type === 'application/kenticocloud' &&
            paragraph.rawAttributes['data-type'] === 'item')
        .map((paragraph: any) => paragraph.rawAttributes['data-codename']);
};

export const getContentOfItem = (item: ISystemAttributes): string => {
    switch (item.contentType) {
        case 'callout':
            return striptags((item as ICallout).content);

        case 'code_sample':
            return (item as ICodeSample).code;

        default:
            return '';
    }
};

export const transformPreprocessedDataToRecords = (blob: IPreprocessedData): IItemRecordsBlob => {
    const specification = blob.items[blob.zapiSpecificationCodename] as IZapiSpecification;
    const apiReferenceProcessor = new ApiReferenceProcessor(blob.items as IGenericItems);

    const itemRecords: IRecord[] = apiReferenceProcessor.processSpecification(specification);

    return {
        codename: specification.codename,
        id: specification.id,
        itemRecords,
        operation: blob.operation,
        section: Section.Api,
    };
};
