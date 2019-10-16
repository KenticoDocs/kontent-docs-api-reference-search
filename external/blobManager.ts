import { ContainerURL } from '@azure/storage-blob';
import {
    Configuration,
    IItemRecordsBlob,
    Operation,
} from 'kontent-docs-shared-code';

const BlobStorage = require('@azure/storage-blob');

export const storeReferenceDataToBlobStorage = async (
    dataBlob: IItemRecordsBlob,
    operation: Operation,
): Promise<void> => {
    const containerUrl = getContainerUrl();
    const blobName = getBlobName(dataBlob.id, operation);
    const blobURL = BlobStorage.BlockBlobURL.fromContainerURL(containerUrl, blobName);

    const blob = JSON.stringify(dataBlob);

    await blobURL.upload(
        BlobStorage.Aborter.none,
        blob,
        blob.length,
    );
};

const getContainerUrl = (): ContainerURL => {
    const sharedKeyCredential = new BlobStorage.SharedKeyCredential(
        Configuration.keys.azureAccountName,
        Configuration.keys.azureStorageKey,
    );
    const pipeline = BlobStorage.StorageURL.newPipeline(sharedKeyCredential);
    const serviceUrl = new BlobStorage.ServiceURL(
        `https://${Configuration.keys.azureAccountName}.blob.core.windows.net`,
        pipeline,
    );

    return BlobStorage.ContainerURL.fromServiceURL(serviceUrl, Configuration.keys.azureContainerName);
};

export const getBlobName = (id: string, operation: Operation): string => {
    switch (operation) {
        case Operation.Update:
        case Operation.Delete:
        case Operation.Initialize: {
            return `${id}.json`;
        }
        case Operation.Preview: {
            return `${id}-preview.json`;
        }
        default: {
            throw Error(`Invalid operation specified in the received blob: ${operation}`);
        }
    }
};
