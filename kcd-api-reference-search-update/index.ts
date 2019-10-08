import {
    AzureFunction,
    Context,
} from '@azure/functions';
import axios from 'axios';
import {
    Configuration,
    getBlobFromStorage,
    IBlobEventGridEvent,
    IItemRecordsBlob,
    IPreprocessedData,
    ISystemAttributes,
    IZapiSpecification,
    Operation,
    Section,
} from 'cloud-docs-shared-code';
import { storeReferenceDataToBlobStorage } from '../external/blobManager';
import { transformPreprocessedDataToRecords } from '../utils/helpers';

export interface IGenericItems {
    readonly [prop: string]: ISystemAttributes;
}

export const eventGridTrigger: AzureFunction = async (
    context: Context,
    eventGridEvent: IBlobEventGridEvent,
): Promise<void> => {
    const isTest = eventGridEvent.data.url.includes('test');
    Configuration.set(isTest);

    const blob: IPreprocessedData = await getBlobFromStorage<IPreprocessedData>(
        eventGridEvent.data.url,
        Configuration.keys.azureAccountName,
        Configuration.keys.azureStorageKey,
    );

    await processBlobWithRecords(blob, isTest);
};

const processBlobWithRecords = async (blob: IPreprocessedData, isTest: boolean) => {
    let recordsBlob: IItemRecordsBlob;

    switch (blob.operation) {
        case Operation.Preview:
            return;

        case Operation.Initialize:
            await clearIndex(isTest, blob);
            recordsBlob = transformPreprocessedDataToRecords(blob);
            break;

        case Operation.Update:
            recordsBlob = transformPreprocessedDataToRecords(blob);
            break;

        case Operation.Delete:
            recordsBlob = getDeleteRecordsBlob(blob);
            break;

        default:
            throw Error('Unsupported operation');
    }

    await storeReferenceDataToBlobStorage(recordsBlob, blob.operation);
};

const clearIndex = async (isTest: boolean, blob: IPreprocessedData): Promise<void> => {
    const clearIndexUrl = Configuration.getClearIndexUrl(isTest, 'API');
    const apiSpecificationId = (blob.items[blob.zapiSpecificationCodename] as IZapiSpecification).id;

    await axios.get(`${clearIndexUrl}&id=${apiSpecificationId}`);
};

const getDeleteRecordsBlob = (
    {zapiSpecificationId, zapiSpecificationCodename, operation}: IPreprocessedData,
): IItemRecordsBlob => ({
    codename: zapiSpecificationCodename,
    id: zapiSpecificationId,
    itemRecords: [],
    operation,
    section: Section.Api,
});
