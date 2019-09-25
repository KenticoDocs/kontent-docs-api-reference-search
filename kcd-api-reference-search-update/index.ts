import {
    AzureFunction,
    Context,
} from '@azure/functions';
import axios from 'axios';
import {
    Configuration,
    getBlobFromStorage,
    IBlobEventGridEvent,
    IPreprocessedData,
    ISystemAttributes,
    IZapiSpecification,
    ReferenceOperation,
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

    if (blob.operation === ReferenceOperation.Preview) {
        return;
    }

    const initialize = blob.operation === ReferenceOperation.Initialize;
    if (initialize) {
        await clearIndex(isTest, blob);
    }

    const recordsBlob = transformPreprocessedDataToRecords(blob, initialize);

    await storeReferenceDataToBlobStorage(recordsBlob, blob.operation);
};

const clearIndex = async (isTest: boolean, blob: IPreprocessedData): Promise<void> => {
    const clearIndexUrl = Configuration.getClearIndexUrl(isTest, 'API');
    const apiSpecificationId = (blob.items[blob.zapiSpecificationCodename] as IZapiSpecification).id;

    await axios.get(`${clearIndexUrl}&id=${apiSpecificationId}`);
};
