import {
    ICodeSamples,
    ISystemAttributes,
} from 'cloud-docs-shared-code';
import { IGenericItems } from '../kcd-api-reference-update';
import { getChildCodenamesFromRichText } from './helpers';

export const getDescriptionItems = (description: string, allItems: IGenericItems): ISystemAttributes[] => {
    const descriptionItemCodenames = getChildCodenamesFromRichText(description);

    return descriptionItemCodenames.reduce(
        (descriptionItems, childCodename) => descriptionItems.concat(getDescriptionItem(allItems, childCodename)),
        [] as ISystemAttributes[],
    );
};

const getDescriptionItem = (allItems: IGenericItems, childCodename: string): ISystemAttributes[] => {
    const item = allItems[childCodename];

    return (item.contentType === 'code_samples')
        ? getCodeSampleItemsFromCodeSamples(item as ICodeSamples, allItems)
        : [item];
};

export const getCodeSampleItemsFromCodeSamples = (
    item: ICodeSamples,
    allItems: IGenericItems,
): ISystemAttributes[] =>
    item
        .codeSamples
        .map((codeSampleCodename) => (allItems[codeSampleCodename]));
