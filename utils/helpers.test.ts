import {
    getChildCodenamesFromRichText,
    getContentOfItem,
} from './helpers';

describe('getContentOfItem', () => {
    it('returns content of callout without html tags', () => {
        const expectedValue = 'Referencing objects that are not there yet\n' +
            'The CM API supports referencing of non-existent objects in the following elements:\n' +
            '\n' +
            'Linked items element\n' +
            'Asset element\n' +
            'Taxonomy element\n' +
            'Rich text element (as assets, content items, and links)\n' +
            '\n' +
            'See how to import linked content to learn more.';
        const callout = {
            codename: 'n7d8b43fc_6408_0137_c60b_286b14cd1ce0',
            content: '<p><strong>Referencing objects that are not there yet</strong>' +
                '</p>\n<p>The CM API supports referencing of non-existent objects in the following elements:' +
                '</p>\n<ul>\n<li>Linked items element</li>\n<li>Asset element</li>\n<li>Taxonomy element</li>' +
                '\n<li><a href="href">Rich text element</a> (as assets, content items, and links)</li>\n</ul>\n<p>' +
                'See how to <a data-item-id="41e4c06e-d21d-42d3-b036-74ca098b0e53" href="href">' +
                'import linked content</a> to learn more.</p>',
            contentType: 'callout',
            id: '7d8b43fc-6408-0137-c60b-286b14cd1ce0',
            type: [
                'Info',
            ],
        };

        const result = getContentOfItem(callout);

        expect(result).toEqual(expectedValue);
    });

    it('returns empty string on unsupported content type', () => {
        const expectedValue = '// Using ES6 syntax\n' +
            'import { ContentManagementClient } from \'kentico-cloud-content-management\';\n\n' +
            'const client = new ContentManagementClient({\n' +
            '  projectId: \'<YOUR_PROJECT_ID>\',\n' +
            '  apiKey: \'<YOUR_API_KEY>\'\n' +
            '});\n\n' +
            'client.listContentItems()\n' +
            '  .toObservable()\n' +
            '  .subscribe((response) => {\n' +
            '    console.log(response);\n' +
            '  },\n' +
            '    (error) => {\n' +
            '      console.log(error);\n' +
            '    });';
        const codeSample = {
            code: '// Using ES6 syntax\nimport { ContentManagementClient } from \'kentico-cloud-content-management\';' +
                '\n\nconst client = new ContentManagementClient({\n  projectId: \'<YOUR_PROJECT_ID>\',\n  apiKey: \'' +
                '<YOUR_API_KEY>\'\n});\n\nclient.listContentItems()\n  .toObservable()\n  .subscribe((response) => ' +
                '{\n    console.log(response);\n  },\n    (error) => {\n      console.log(error);\n    });',
            codename: 'cm_api_v2_get_items_js',
            contentType: 'code_sample',
            id: '094cc49d-2468-4532-b09d-b949b8d27a83',
            platform: [
                'JavaScript',
            ],
            programmingLanguage: [
                'JavaScript',
            ],
        };

        const result = getContentOfItem(codeSample);

        expect(result).toEqual(expectedValue);
    });

    it('returns empty string on unsupported content type', () => {
        const expectedValue = '';
        const item = {
            acceptedValues: '',
            apiReference: [
                'Content Management API v2',
            ],
            codename: 'c9ba1e25_330d_0168_866c_eb0b404a3f2d',
            contentType: 'zapi_schema__string',
            defaultValue: '',
            description: '<p><br></p>',
            example: '',
            format: '',
            id: 'c9ba1e25-330d-0168-866c-eb0b404a3f2d',
            maxLength: null,
            minLength: null,
            name: 'message',
            nullable: [],
            readonly: [],
            writeonly: [],
        };

        const result = getContentOfItem(item);

        expect(result).toEqual(expectedValue);
    });
});

describe('getChildCodenamesFromRichText', () => {
    it('gets codenames of components and linked items correctly', () => {
        const content = '<p ' +
            'type="application/kenticocloud"' +
            ' data-type="item"' +
            ' data-rel="component"' +
            ' data-codename="c9ba1e25_330d_0168_866c_eb0b404a3f2d"' +
            ' data-sdk-resolved="1"' +
            ' class="kc-linked-item-wrapper"' +
            '></p>\n' +
            '<p ' +
            'type="application/kenticocloud"' +
            ' data-type="item"' +
            ' data-rel="link"' +
            'data-codename="n1634236b_de8d_0151_0b8e_7b20ba5affb5"' +
            'data-sdk-resolved="1"' +
            'class="kc-linked-item-wrapper">' +
            '</p>\n' +
            '<p ' +
            'type="application/kenticocloud"' +
            'data-type="item"' +
            'data-rel="component"' +
            'data-codename="f4b913a0_e14f_010f_253d_b39136f816e2"' +
            'data-sdk-resolved="1"' +
            'class="kc-linked-item-wrapper">' +
            '</p>\n' +
            '<p ' +
            'type="application/kenticocloud"' +
            'data-type="item"' +
            'data-rel="link"' +
            'data-codename="f364dd9e_e879_0178_5358_602516621d7d"' +
            'data-sdk-resolved="1"' +
            'class="kc-linked-item-wrapper"></p>';
        const expectedCodenames = [
            'c9ba1e25_330d_0168_866c_eb0b404a3f2d',
            'n1634236b_de8d_0151_0b8e_7b20ba5affb5',
            'f4b913a0_e14f_010f_253d_b39136f816e2',
            'f364dd9e_e879_0178_5358_602516621d7d',
        ];

        const actualCodenames = getChildCodenamesFromRichText(content);

        expect(actualCodenames.sort()).toEqual(expectedCodenames.sort());
    });
});
