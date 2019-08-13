import {
    ICategory,
    ICodeSamples,
    IPathOperation,
    IRecord,
    IResponse,
    ISecurityScheme,
    ISystemAttributes,
    IZapiSpecification,
} from 'cloud-docs-shared-code';
import { getChildCodenamesFromRichText } from '../utils/helpers';
import {
    getCodeSampleItemsFromCodeSamples,
    getDescriptionItems,
} from '../utils/itemGetters';
import {
    createGenericDescriptionRecord,
    createGenericRecordFromDescriptionContent,
    createResponseDescriptionContentRecord,
    createSpecificationDescriptionRecord,
} from '../utils/recordCreators';
import { IGenericItems } from './index';

export interface IPartialRecord {
    codename: string;
    content: string;
    heading: string;
    objectID: string;
}

export class ApiReferenceProcessor {
    private readonly items: IGenericItems;

    constructor(items: IGenericItems) {
        this.items = items;
    }

    public processSpecification = (specification: IZapiSpecification): IRecord[] => {
        const {title, categories, id, security, version} = specification;
        const specificationRecord: IPartialRecord = createGenericRecordFromDescriptionContent(
            specification,
            title + version,
        );

        return [specificationRecord]
            .concat(
                this.createRecordsFromSpecificationDescription(specification),
                this.processCategories(categories),
                this.processAuthentication(security),
            )
            .map((record) => ({
                ...record,
                id,
                section: 'API',
                title,
            }));
    };

    private processAuthentication = (securityCodenames: string[]): IPartialRecord[] =>
        securityCodenames
            .reduce(
                this.concatAuthenticationRecords(),
                [] as IPartialRecord[],
            );

    private concatAuthenticationRecords = () =>
        (authenticationRecords: IPartialRecord[], codename: string) =>
            authenticationRecords
                .concat(
                    this.createRecordsFromAuthenticationDescription(
                        this.items[codename] as ISecurityScheme,
                    ),
                );

    private createRecordsFromAuthenticationDescription = (authentication: ISecurityScheme): IPartialRecord[] => {
        const descriptionItems = getDescriptionItems(authentication.description, this.items);

        const securityItemRecord: IPartialRecord =
            createGenericRecordFromDescriptionContent(authentication, 'Authentication');

        return [securityItemRecord]
            .concat(descriptionItems
                .map(createGenericDescriptionRecord(authentication)),
            )
    };

    private processCategories = (categoriesCodenames: string[]): IPartialRecord[] =>
        categoriesCodenames.reduce(
            this.createCategoryRecords(),
            [] as IPartialRecord[],
        );

    private processPathOperations = (codenames: string[]): IPartialRecord[] =>
        codenames.reduce(
            this.concatPathOperationDescriptionRecords(),
            [] as IPartialRecord[],
        );

    private createCategoryRecords = () =>
        (categoryRecords: IPartialRecord[], categoryCodename: string): IPartialRecord[] => {
            const category = this.items[categoryCodename] as ICategory;

            return categoryRecords
                .concat(
                    this.createRecordsFromCategoryDescription(category),
                    this.processPathOperations(category.pathOperations),
                )
        };

    private createRecordsFromCategoryDescription = (category: ICategory): IPartialRecord[] => {
        const descriptionItems = getDescriptionItems(category.description, this.items);
        const descriptionContentRecord: IPartialRecord =
            createGenericRecordFromDescriptionContent(category, category.name);

        return descriptionItems
            .map(createGenericDescriptionRecord(category))
            .concat([descriptionContentRecord]);
    };

    private concatPathOperationDescriptionRecords = () =>
        (pathOperationRecords: IPartialRecord[], pathOperationCodename: string): IPartialRecord[] =>
            pathOperationRecords.concat(
                this.createRecordsFromPathOperationDescription(pathOperationCodename),
            );

    private createRecordsFromPathOperationDescription = (codename: string): IPartialRecord[] => {
        const pathOperation = this.items[codename] as IPathOperation;
        const descriptionItems = getDescriptionItems(pathOperation.description, this.items);
        const descriptionContentRecord: IPartialRecord =
            createGenericRecordFromDescriptionContent(pathOperation, pathOperation.name);

        return descriptionItems
            .concat(pathOperation.codeSamples
                .reduce(
                    this.concatCodeSampleItems(),
                    [] as ISystemAttributes[]),
            )
            .map(createGenericDescriptionRecord(pathOperation))
            .concat(
                this.processResponses(pathOperation),
                [descriptionContentRecord],
            );
    };

    private concatCodeSampleItems = () =>
        (codeSampleItems: ISystemAttributes[], codeSampleCodename: string): ISystemAttributes[] =>
            codeSampleItems.concat(
                getCodeSampleItemsFromCodeSamples(this.items[codeSampleCodename] as ICodeSamples, this.items),
            );

    private createResponseRecords = (pathOperation: IPathOperation) =>
        (descriptionRecords: IPartialRecord[], responseItem: IResponse): IPartialRecord[] =>
            descriptionRecords.concat(
                this.createRecordsFromResponseDescription(
                    responseItem,
                    pathOperation,
                ),
            );

    private processResponses = (pathOperation: IPathOperation): IPartialRecord[] =>
        getChildCodenamesFromRichText(pathOperation.responses)
            .map((codename) => this.items[codename] as IResponse)
            .reduce(
                this.createResponseRecords(pathOperation),
                [] as IPartialRecord[],
            );

    private createRecordsFromResponseDescription = (
        response: IResponse,
        pathOperation: IPathOperation,
    ): IPartialRecord[] => {
        const descriptionItems = getDescriptionItems(response.description, this.items);
        const descriptionRecord = createResponseDescriptionContentRecord(
            response,
            pathOperation,
        );

        return descriptionItems
            .map(createGenericDescriptionRecord(pathOperation))
            .concat([descriptionRecord]);
    };

    private createRecordsFromSpecificationDescription = (specification: IZapiSpecification): IPartialRecord[] =>
        getDescriptionItems(specification.description, this.items)
            .map(createSpecificationDescriptionRecord(specification));
}
