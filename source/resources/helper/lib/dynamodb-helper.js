/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0 */

/**
 * @author Solution Builders
 */

'use strict';

let moment = require('moment');
let AWS = require('aws-sdk');

let creds = new AWS.EnvironmentCredentials('AWS'); // Lambda provided credentials
const dynamoConfig = {
    credentials: creds,
    region: process.env.AWS_REGION
};
const docClient = new AWS.DynamoDB.DocumentClient(dynamoConfig);
const ddbTable = 'data-lake-settings';

/**
 * Helper function to interact with dynamodb for data lake cfn custom resource.
 *
 * @class dynamoDBHelper
 */
let dynamoDBHelper = (function() {

    /**
     * @class dynamoDBHelper
     * @constructor
     */
    let dynamoDBHelper = function() {};

    /**
     * Saves the app configuration settings for the data lake at deployment.
     * @param {string} settings - Settings to save in data-lake-settings.
     * @param {saveAppConfigSettings~requestCallback} cb - The callback that handles the response.
     */
    dynamoDBHelper.prototype.saveDataLakeConfigSettings = function(appConfig, cb) {
        let _setting = {
            setting_id: 'app-config',
            type: 'config',
            created_at: moment.utc().format(),
            updated_at: moment.utc().format(),
            setting: appConfig
        };

        let params = {
            TableName: ddbTable,
            Item: _setting
        };

        docClient.put(params, function(err, data) {
            if (err) {
                return cb(err, null);
            }

            return cb(null, _setting);
        });
    };

    return dynamoDBHelper;

})();

module.exports = dynamoDBHelper;
