import {
    AzureFunction,
    Context,
} from '@azure/functions'
import axios from 'axios';
import {
    Configuration,
    getBlobFromStorage,
    IBlobEventGridEvent,
    IPreprocessedData,
    ISystemAttributes,
    ReferenceOperation,
} from 'cloud-docs-shared-code';
import { storeReferenceDataToBlobStorage } from '../external/blobManager';
import { transformPreprocessedDataToRecords } from '../utils/helpers';

export interface IGenericItems {
    [prop: string]: ISystemAttributes;
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
    const initialize = blob.operation === ReferenceOperation.Initialize;

    if (blob.operation === ReferenceOperation.Preview) {
        return;
    } else if (initialize) {
        await axios.get(Configuration.getClearIndexUrl(isTest, 'API'));
    }

    const recordsBlob = transformPreprocessedDataToRecords(blob, initialize);

    await storeReferenceDataToBlobStorage(recordsBlob, blob.operation)
};
