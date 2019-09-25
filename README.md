| [master](https://github.com/KenticoDocs/cloud-docs-api-reference-search/tree/master) | [develop](https://github.com/KenticoDocs/cloud-docs-api-reference-search/tree/develop) |
|:---:|:---:|
| [![Build Status](https://github.com/KenticoDocs/cloud-docs-api-reference-search.svg?branch=master)](https://github.com/KenticoDocs/cloud-docs-api-reference-search/branches) [![codebeat badge](https://codebeat.co/badges/dd1651b4-8d34-43c1-895b-e449caaa44f6)](https://codebeat.co/projects/github-com-kenticodocs-cloud-docs-api-reference-search-master) | [![Build Status](https://github.com/KenticoDocs/cloud-docs-api-reference-search.svg?branch=develop)](https://github.com/KenticoDocs/cloud-docs-api-reference-search/branches) [![codebeat badge](https://codebeat.co/badges/ebd03122-bed1-4281-8e4e-8f601962e810)](https://codebeat.co/projects/github-com-kenticodocs-cloud-docs-api-reference-search-develop-55d63c37-b306-4924-944e-aac82cd77e5f) |


# Kentico Cloud Documentation - API Reference Search
Backend service for Kentico Cloud [documentation portal](https://docs.kenticocloud.com/), which utilizes Kentico Cloud as a source of its content.

In order to provide an exquisite search experience, this service is responsible for indexing content of the documentation portal's API reference.
It responds to events triggered by the blob storage, after the [Reference Preprocessor](https://github.com/KenticoDocs/cloud-docs-reference-preprocessor) creates a blob with the preprocessed data. The API reference service processes the data and stores the content ready to index on [Algolia](https://www.algolia.com/) in an [Azure Blob Storage](https://azure.microsoft.com/en-us/services/storage/blobs/).

## Overview
1. This project is a TypeScript Azure Functions application.
2. It is subscribed to an Azure [Event Grid](https://azure.microsoft.com/en-us/services/event-grid/) topic and listens for events. Each event contains information about the content that was changed.
3. After receiving an event, it fetches the content from the Blob storage.
4. The fetched content is then split into smaller [Algolia-compatible records](https://www.algolia.com/doc/faq/basics/what-is-a-record/). 
5. Finally the records are stored in an Azure Blob Storage, where the following [Indexing Sync](https://github.com/KenticoDocs/cloud-docs-index-sync) service can access it and update the index on Algolia accordingly.

## Setup

### Prerequisites
1. Node (+yarn) installed
2. Visual Studio Code installed
3. Subscriptions on MS Azure, Kentico Cloud and Algolia

### Instructions
1. Open Visual Studio Code and install the prerequisites according to the [following steps](https://code.visualstudio.com/tutorials/functions-extension/getting-started).
2. Log in to Azure using the Azure Functions extension tab.
3. Clone the project repository and open it in Visual Studio Code.
4. Run `yarn install` in the terminal.
5. Set the required keys.
6. Deploy to Azure using Azure Functions extension tab, or run locally by pressing `Ctrl + F5` in Visual Studio Code.

#### Required Keys
* `Azure.StorageKey` - Azure Storage key
* `Azure.StorageAccountName` - Azure Storage account name
* `Azure.ContainerName` - Azure Storage container name
* `Azure.ClearIndexUrl` - URL of the [`kcd-clear-index` Azure function](https://github.com/KenticoDocs/cloud-docs-index-sync)

## Testing
* Run `yarn run test` in the terminal.

## How To Contribute
Feel free to open a new issue where you describe your proposed changes, or even create a new pull request from your branch with proposed changes.

## Licence
All the source codes are published under MIT licence.
