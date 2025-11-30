const chalk = require('chalk');

class Logger {
    static info(service, message, data = null) {
        const timestamp = new Date().toISOString();
        console.log(
            chalk.blue(`[${timestamp}]`),
            chalk.cyan(`[${service}]`),
            chalk.white(message),
            data ? chalk.gray(JSON.stringify(data)) : ''
        );
    }

    static error(service, message, error = null) {
        const timestamp = new Date().toISOString();
        console.error(
            chalk.blue(`[${timestamp}]`),
            chalk.red(`[${service}]`),
            chalk.red(message),
            error ? chalk.gray(error.stack || error) : ''
        );
    }

    static warn(service, message, data = null) {
        const timestamp = new Date().toISOString();
        console.warn(
            chalk.blue(`[${timestamp}]`),
            chalk.yellow(`[${service}]`),
            chalk.yellow(message),
            data ? chalk.gray(JSON.stringify(data)) : ''
        );
    }

    static success(service, message, data = null) {
        const timestamp = new Date().toISOString();
        console.log(
            chalk.blue(`[${timestamp}]`),
            chalk.green(`[${service}]`),
            chalk.green(message),
            data ? chalk.gray(JSON.stringify(data)) : ''
        );
    }

    static debug(service, message, data = null) {
        if (process.env.DEBUG === 'true') {
            const timestamp = new Date().toISOString();
            console.log(
                chalk.blue(`[${timestamp}]`),
                chalk.magenta(`[${service}]`),
                chalk.gray(message),
                data ? chalk.gray(JSON.stringify(data)) : ''
            );
        }
    }
}

module.exports = Logger;
