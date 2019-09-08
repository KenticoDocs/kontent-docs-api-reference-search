import { ReferenceOperation } from 'cloud-docs-shared-code/reference/preprocessedModels';
import { getBlobName } from './blobManager';

describe('getBlobName', () => {
    it('returns correct blob name for initialize operation', () => {
        const id = '12345-67890';
        const operation = ReferenceOperation.Initialize;
        const expectedResult = id;

        const actualResult = getBlobName(id, operation);

        expect(actualResult).toEqual(expectedResult);
    });

    it('returns correct blob name for update operation', () => {
        const id = '12345-67890';
        const operation = ReferenceOperation.Update;
        const expectedResult = id;

        const actualResult = getBlobName(id, operation);

        expect(actualResult).toEqual(expectedResult);
    });

    it('returns correct blob name for preview operation', () => {
        const id = '12345-67890';
        const operation = ReferenceOperation.Preview;
        const expectedResult = `${id}-preview.json`;

        const actualResult = getBlobName(id, operation);

        expect(actualResult).toEqual(expectedResult);
    });

    it('throws for unknown operation', () => {
        const codename = 'content_management_api';
        const operation = 'Unknown';

        expect(() => getBlobName(codename, operation as ReferenceOperation)).toThrow();
    });
});
