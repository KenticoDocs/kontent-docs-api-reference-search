import { ContainerURL } from '@azure/storage-blob';
import {
    Configuration,
    IItemRecordsBlob,
} from 'cloud-docs-shared-code';
import { ReferenceOperation } from 'cloud-docs-shared-code/reference/preprocessedModels';

const BlobStorage = require('@azure/storage-blob');

export const storeReferenceDataToBlobStorage = async (
    dataBlob: IItemRecordsBlob,
    operation: ReferenceOperation,
): Promise<void> => {
    const containerUrl = getContainerUrl();
    const blobId = getBlobId(dataBlob.codename, operation);
    const blobURL = BlobStorage.BlobURL.fromContainerURL(containerUrl, blobId);
    const blockBlobURL = BlobStorage.BlockBlobURL.fromBlobURL(blobURL);

    const blob = JSON.stringify(dataBlob);

    await blockBlobURL.upload(
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

export const getBlobId = (codename: string, operation: ReferenceOperation): string => {
    switch (operation) {
        case ReferenceOperation.Update:
        case ReferenceOperation.Initialize: {
            return codename;
        }
        case ReferenceOperation.Preview: {
            return `${codename}-preview.json`;
        }
        default: {
            throw Error('Invalid operation');
        }
    }
};
