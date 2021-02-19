import {
    ICategory,
    IPathOperation,
    ISecurityScheme,
    ISystemAttributes,
    IZapiSpecification,
} from 'kontent-docs-shared-code';
import * as striptags from 'striptags';
import { IPartialRecord } from './ApiReferenceProcessor';
import { getContentOfItem, isCodeSample } from './helpers';

type CommonTypesWithDescription = IPathOperation | ISecurityScheme | ICategory | IZapiSpecification;

export const createGenericDescriptionRecord = (item: ICategory | IPathOperation | ISecurityScheme) =>
    (genericItem: ISystemAttributes): IPartialRecord => ({
        codename: item.codename,
        content: getContentOfItem(genericItem),
        heading: item.contentType === 'zapi_security_scheme'
            ? 'Authentication'
            : item.name,
        objectID: `${item.codename}##${genericItem.id}`,
        isCodeSample: isCodeSample(genericItem.contentType)
    });

export const createGenericRecordFromDescriptionContent = (
    { codename, description, id, contentType }: CommonTypesWithDescription,
    heading: string,
): IPartialRecord => ({
    codename,
    content: striptags(description),
    heading,
    objectID: id,
    isCodeSample: isCodeSample(contentType)
});

export const createSpecificationDescriptionRecord = ({ codename, title, contentType }: IZapiSpecification) =>
    (descriptionItem: ISystemAttributes): IPartialRecord => ({
        codename,
        content: getContentOfItem(descriptionItem),
        heading: title,
        objectID: descriptionItem.id,
        isCodeSample: isCodeSample(descriptionItem.contentType)
    });
