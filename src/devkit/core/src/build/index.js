'use strict';
var merge = GLOBAL.merge;

var ff = require('ff');
var fs = require('fs');
var color = require('cli-color');

var logger = require('../util/logging').get('build');
var apps = require('../apps');

exports.build = function (appPath, argv, cb) {
    var startTime = Date.now();
    logger.log(color.cyanBright("starting build at", new Date()));
    var config;
    var elapsed = 0;

    // of these custom functions
    var buildInfoPath;
    /** key is optional. if no key, return the whole object */
    var getBuildInfo = function (key) {
        if (!buildInfoPath) {
            logger.error('Cannot GET build info before buildInfoPath is set');
            return null;
        }

        var buildInfo;
        try {
            buildInfo = JSON.parse(fs.readFileSync(buildInfoPath));
        } catch (err) {
            logger.error('Error while getting build info: ' + err.message);
            buildInfo = {};
        }

        if (key) {
            return buildInfo[key];
        }
        return buildInfo;
    };
    /** if no value is set, key is assumed to be whole object and old object obliterated */
    var setBuildInfo = function (key, value) {
        if (!buildInfoPath) {
            logger.error('Cannot SET build info before buildInfoPath is set');
            return;
        }
        try {
            if (value === undefined) {
                if (typeof key === 'object') {
                    fs.writeFileSync(buildInfoPath, JSON.stringify(key));
                } else {
                    logger.error('Cannot write non object for buildInfo' + key);
                    return;
                }
            } else {
                var buildInfo = getBuildInfo();
                buildInfo[key] = value;
                fs.writeFileSync(buildInfoPath, JSON.stringify(buildInfo));
            }
        } catch (err) {
            logger.error('Error while setting buildInfo: ' + err.message);
            buildInfoPath = null;
        }
    };
    var app, f;
    var _hasLock = false;
    var steps = [
        function () {
            apps.has(appPath, f());
        },
        function (appLoaded) {
            var next = f.wait();
            apps.get(appPath, function (err, res) {
                if (err && !argv.help) {
                    if (err.code === 'ENOENT') {
                        logger.error('the current directory is not a devkit app');
                    } else {
                        logger.error(err);
                    }
                    next(err);
                } else {
                    app = res;
                    // ensure the manifest is up-to-date
                    try {
                        if (appLoaded) {
                            app.reloadSync();
                        }
                    } catch (e) {
                        return next(e);
                    }
                    next();
                }
            });
        },
        function () {
            require('./steps/getConfig').getConfig(app, argv, (err, res)=>{
                config = res;
                require('./steps/createDirectories').createDirectories(app, config, f());
            });
        },
        function () {
            // Set up the .buildInfo file
            buildInfoPath = config.outputPath + '/.buildInfo';
            // Overwrite old one
            setBuildInfo({
                timeStarted: startTime,
                timeStopped: 0,
                active: true,
                currentStep: 0,
                steps: 8, // Number of times incrementBuildInfoStep will be called
                errors: ''
            });
        },
        function () {
            require('./steps/buildHooks').getDependencies(app, config, f());
        },
        function (deps) {
            // deps is an array of objects, merge them into one object and get all keys with false values
            deps = merge.apply(this, deps);
            var toRemove = Object.keys(deps).filter(function (name) {
                return deps[name] === false;
            });
            app.removeModules(toRemove);
        },
        function () {
            require('./steps/moduleConfig').getConfig(app, config, f());
        },
        function () {
            require('./steps/buildHooks').onBeforeBuild(app, config, f());
        },
        function () {
            require('./steps/executeTargetBuild')(app, config, f());
        },
        function () {
            require('./steps/buildHooks').onAfterBuild(app, config, f());
        }
        ];

    f = ff.apply(null, steps)
        .error(function (err) {
            if (err.code === 'EEXIST' && !_hasLock) {
                return logger.error('another build is already in progress');
            }

            logger.error('build failed', err);
            process.exit(1);
            var errMsg;
            if (err.stack) {
                errMsg = err.stack;
            } else {
                errMsg = err;
            }
            logger.error(errMsg);

            setBuildInfo('errors', errMsg);
        })
        .success(function () {
            logger.log('build succeeded');
        })
        .cb(function () {
            if (_hasLock) {
                app.releaseLock(function (err) {
                    if (err) {
                        logger.error(err);
                    }
                });
            }

            elapsed = (Date.now() - startTime) / 1000;
            var minutes = Math.floor(elapsed / 60);
            var seconds = (elapsed % 60).toFixed(2);
            logger.log((minutes ? minutes + ' minutes, ' : '') + seconds + ' seconds elapsed');
        })
        .cb(function onFinish(err, res) {
            cb(err, merge({
                elapsed: elapsed,
                config: config
            }, res));
            setBuildInfo('active', false);
            setBuildInfo('timeStopped', Date.now());
        });
};
