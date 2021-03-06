import { Operation } from 'kontent-docs-shared-code/reference/preprocessedModels';
import { getBlobName } from './blobManager';

describe('getBlobName', () => {
    it('returns correct blob name for initialize operation', () => {
        const id = '12345-67890';
        const operation = Operation.Initialize;
        const expectedResult = `${id}.json`;

        const actualResult = getBlobName(id, operation);

        expect(actualResult).toEqual(expectedResult);
    });

    it('returns correct blob name for update operation', () => {
        const id = '12345-67890';
        const operation = Operation.Update;
        const expectedResult = `${id}.json`;

        const actualResult = getBlobName(id, operation);

        expect(actualResult).toEqual(expectedResult);
    });

    it('returns correct blob name for preview operation', () => {
        const id = '12345-67890';
        const operation = Operation.Preview;
        const expectedResult = `${id}-preview.json`;

        const actualResult = getBlobName(id, operation);

        expect(actualResult).toEqual(expectedResult);
    });

    it('throws for unknown operation', () => {
        const codename = 'content_management_api';
        const operation = 'Unknown';

        expect(() => getBlobName(codename, operation as Operation)).toThrow();
    });
});
