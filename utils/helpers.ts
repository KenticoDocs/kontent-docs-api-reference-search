import {
    ICallout,
    ICodeSample,
    IItemRecordsBlob,
    IPreprocessedData,
    IRecord,
    ISystemAttributes,
    IZapiSpecification,
} from 'cloud-docs-shared-code';
import {
    HTMLElement,
    parse,
} from 'node-html-parser';
import * as striptags from 'striptags';
import { IGenericItems } from '../kcd-api-reference-update';
import { ApiReferenceProcessor } from '../kcd-api-reference-update/ApiReferenceProcessor';

export const getChildCodenamesFromRichText = (content: string): string[] => {
    const root = parse(content) as HTMLElement;
    const objectElements = root.querySelectorAll('p');

    const linkedItemCodenames = getInnerItemCodenames(objectElements, 'link');
    const componentCodenames = getInnerItemCodenames(objectElements, 'component');

    return linkedItemCodenames.concat(componentCodenames);
};

const getInnerItemCodenames = (elements: HTMLElement[], type: string): string[] =>
    elements
        .filter((objectElement: any) =>
            objectElement.rawAttributes.type === 'application/kenticocloud' &&
            objectElement.rawAttributes['data-type'] === 'item' &&
            objectElement.rawAttributes['data-rel'] === type)
        .map((objectElement: any) => objectElement.rawAttributes['data-codename']);

export const getContentOfItem = (childItem: ISystemAttributes): string => {
    switch (childItem.contentType) {
        case 'callout':
            return striptags((childItem as ICallout).content);

        case 'code_sample':
            return (childItem as ICodeSample).code;

        default:
            return '';
    }
};

export const transformPreprocessedDataToRecords = (blob: IPreprocessedData, initialize: boolean) => {
    const specification = blob.items[blob.zapiSpecificationCodename] as IZapiSpecification;
    const apiReferenceProcessor = new ApiReferenceProcessor(blob.items as IGenericItems);

    const itemRecords: IRecord[] = apiReferenceProcessor.processSpecification(specification);

    return createBlobWithRecords(specification, initialize, itemRecords);
};

const createBlobWithRecords = (
    specification: IZapiSpecification,
    initialize: boolean,
    itemRecords: IRecord[],
): IItemRecordsBlob => ({
    codename: specification.codename,
    id: specification.id,
    initialize,
    itemRecords,
});
