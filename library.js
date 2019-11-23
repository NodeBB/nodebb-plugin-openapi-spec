'use strict';

const _ = require('lodash');
const expressOasGenerator = require('express-oas-generator');
const pkg = require.main.require('./src/../install/package.json');
const winston = require.main.require('winston');
const nconf = require.main.require('nconf');
const meta = require.main.require('./src/meta');
const db = require.main.require('./src/database');
const plg = require('./plugin.json');
const jsonSize = require('json-size')

const defaultSettings = {
    includeResponseBodyExamples: 'off',
    includePattern: null,
    excludePattern: null,
    writeInterval: 60 * 1000    
};

const plugin = module.exports;
plugin.Name = plg.name;
plugin.name = plg.name.toLowerCase();

plugin.init = async function (data) {
	let settings = (await meta.settings.get(plugin.name)) || {};
    plugin.settings = {
        ...defaultSettings,
        ...settings
    };
    try {
        plugin.settings.includePattern = plugin.settings.includePattern && new RegExp(plugin.settings.includePattern);
    } catch (e) {
        winston.warn(`[${plugin.name}] includePattern ${plugin.settings.includePattern} is not a valid regexp, skipping...`);
        plugin.settings.includePattern = null;
    }
    try {
        plugin.settings.excludePattern = plugin.settings.excludePattern && new RegExp(plugin.settings.excludePattern);
    } catch (e) {
        winston.warn(`[${plugin.name}] excludePattern ${plugin.settings.excludePattern} is not a valid regexp, skipping...`);
        plugin.settings.excludePattern = null;
    }
    plugin.baseUrl = nconf.get('url');
    plugin.router = data.router;
    plugin.app = data.app;

    plugin.onReady = expressOasGenerator.init({ 
        router: plugin.router,
        app: plugin.app,
        store: plugin.store,
        predefinedSpec: plugin.predefined,
        apiSpecPath: `/api/plugins/${plugin.name}/spec`,
        apiDocsPath: `/plugins/${plugin.name}/docs`,
        baseUrlPath: plugin.baseUrl,
        writeInterval: parseInt(plugin.settings.writeInterval, 10) || defaultSettings.writeInterval
    })
	data.router.get(`/admin/plugins/${plugin.name}`, data.middleware.admin.buildHeader, plugin.renderAdminPage);
    data.router.get(`/api/admin/plugins/${plugin.name}`, plugin.renderAdminPage);
};

plugin.parseRoutes = async function () {
    if (plugin.onReady) {
        plugin.onReady();
        winston.info(`[${plugin.name}] routes parsed and ready`);
    } else {
        winston.warn(`[${plugin.name}] Something is wrong, onReady is not set`);
    }
};

plugin.addAdminNavigation = async function (header) {
	header.plugins.push({
		route: `/plugins/${plugin.name}`,
		icon: 'fa-edit',
		name: plugin.Name
	});
	return header;
};

plugin.renderAdminPage = function (req, res) {
	res.render(`admin/plugins/${plugin.name}`, {});
};

const removeDots = (json) => {
	json.paths = Object.keys(json.paths)
		.reduce((paths, k) => {
			paths[k.replace(/\./g, '__dot__')] = json.paths[k];
			return paths;
        }, {});
    return json;
};

const filterPaths = (json, { includePattern, excludePattern }) => {
	json.paths = Object.keys(json.paths)
		.filter(path => /\/api/.test(path))
		.filter(path => (includePattern ? includePattern.test(path) : excludePattern ? excludePattern.test(path) : true))
		.reduce((paths, k) => {
			paths[k.replace(/__dot__/g, '.')] = json.paths[k];
			return paths;
		}, {});
};

const removeSchemaExamples = (response) => {
    for (const prop in response.properties) {
        if (response.properties[prop].type === 'object') {
            removeSchemaExamples(response.properties[prop]);
        } else {
            response.properties[prop].example = null
            response.properties[prop].exampleNote = 'Example is hidden'
        }
    }
};

const removeExamples = (json) => {
    // yup
    _.each(json.paths || {}, path => {
    // yup
        _.each(path || {}, method => {
    // yup
            _.each(method.responses || {}, response => {            
    // yup
                removeSchemaExamples(response.schema || {});
            });
        });
    });
};

plugin.predefined = function (json, { req, res }) {
    let d = _.cloneDeep(json);

    if (plugin.baseUrl) {
        d.servers = _.uniqBy([].concat(d.servers || []).concat({ url: plugin.baseUrl }), 'url');
    }
    filterPaths(d, { includePattern: plugin.settings.includePattern, excludePattern: plugin.settings.excludePattern })

    if (plugin.settings.includeResponseBodyExamples !== 'on') {
        // so we won't show sensitive info that were sent in any response body
        // path and query params because, well, they are kinda public.
        removeExamples(d);
    }
    return d;
};

plugin.store = {
    async getSpec() {
        let spec = await db.getObject(`${plugin.name}:spec`);
        spec.fullSizeBytes = jsonSize(spec);
        return spec;
    },
    async setSpec(data) {
        let d = _.cloneDeep(data)
        delete d.info;
        delete d.servers;
        delete d.fullSizeBytes;
        d = removeDots(d);
        try {
            await db.setObject(`${plugin.name}:spec`, d);
        } catch (e) {
            winston.warn(`[${plugin.name}] Unable to store spec`, e);
        }
    },
    async clearSpec() {
        try {
            await db.delete(`${plugin.name}:spec`);
            await db.setObject(`${plugin.name}:spec`, {});
        } catch (e) {
            winston.warn(`[${plugin.name}] Unable to clear spec`, e);
        }
    }  
};