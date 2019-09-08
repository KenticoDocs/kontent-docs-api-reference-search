import {
    ICategory,
    IPathOperation,
    IResponse,
    ISecurityScheme,
    ISystemAttributes,
    IZapiSpecification,
} from 'cloud-docs-shared-code';
import * as striptags from 'striptags';
import { IPartialRecord } from './ApiReferenceProcessor';
import { getContentOfItem } from './helpers';

type CommonTypesWithDescription = IPathOperation | ISecurityScheme | ICategory | IZapiSpecification;

export const createGenericDescriptionRecord = (item: ICategory | IPathOperation | ISecurityScheme) =>
    (genericItem: ISystemAttributes): IPartialRecord => ({
        codename: genericItem.codename,
        content: getContentOfItem(genericItem),
        heading: item.contentType === 'zapi_security_scheme'
            ? 'Authentication'
            : item.name,
        objectID: `${item.codename}##${genericItem.id}`,
    });

export const createGenericRecordFromDescriptionContent = (
    { codename, description, id }: CommonTypesWithDescription,
    heading: string,
): IPartialRecord => ({
    codename,
    content: striptags(description),
    heading,
    objectID: id,
});

export const createSpecificationDescriptionRecord = ({ codename, title }: IZapiSpecification) =>
    (descriptionItem: ISystemAttributes): IPartialRecord => ({
        codename,
        content: getContentOfItem(descriptionItem),
        heading: title,
        objectID: descriptionItem.id,
    });

export const createResponseDescriptionContentRecord = (
    response: IResponse,
    { codename, name }: IPathOperation,
): IPartialRecord => ({
    codename,
    content: `${response.httpStatus[0]} ${striptags(response.description)}`,
    heading: name,
    objectID: `${codename}##${response.id}`,
});
