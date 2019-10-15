import {
    ICategory,
    ICodeSamples,
    IPathOperation,
    IRecord,
    ISystemAttributes,
    IZapiSpecification,
    Section,
} from 'kontent-docs-shared-code';
import { IGenericItems } from '../kcd-api-reference-search-update';
import {
    getCodeSampleItemsFromCodeSamples,
    getDescriptionItems,
} from './itemGetters';
import {
    createGenericDescriptionRecord,
    createGenericRecordFromDescriptionContent,
    createSpecificationDescriptionRecord,
} from './recordCreators';

export interface IPartialRecord {
    readonly codename: string;
    readonly content: string;
    readonly heading: string;
    readonly objectID: string;
}

export class ApiReferenceProcessor {
    private readonly items: IGenericItems;

    constructor(items: IGenericItems) {
        this.items = items;
    }

    public processSpecification = (specification: IZapiSpecification): IRecord[] => {
        const {title, categories, id, version} = specification;
        const specificationRecord: IPartialRecord = createGenericRecordFromDescriptionContent(
            specification,
            title + version,
        );

        return [specificationRecord]
            .concat(
                this.createRecordsFromSpecificationDescription(specification),
                this.processCategories(categories),
            )
            .map((record) => ({
                ...record,
                id,
                section: Section.Api,
                title,
            }))
            .filter((record) => record.content);
    };

    private processCategories = (categoryCodenames: string[]): IPartialRecord[] =>
        categoryCodenames.reduce(
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
            .concat([descriptionContentRecord]);
    };

    private concatCodeSampleItems = () =>
        (codeSampleItems: ISystemAttributes[], codeSampleCodename: string): ISystemAttributes[] =>
            codeSampleItems.concat(
                getCodeSampleItemsFromCodeSamples(this.items[codeSampleCodename] as ICodeSamples, this.items),
            );

    private createRecordsFromSpecificationDescription = (specification: IZapiSpecification): IPartialRecord[] =>
        getDescriptionItems(specification.description, this.items)
            .map(createSpecificationDescriptionRecord(specification));
}
