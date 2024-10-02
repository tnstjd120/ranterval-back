import * as dotenv from 'dotenv';
import * as pathUtil from 'path';
import * as fs from 'fs';

const envOptions = {};

const loadConfig = async (env) => {

    let fileExt = '';
    switch (env) {
        case 'production':
            fileExt = 'production';
            break;
        case 'development':
            fileExt = 'development';
            break;
        default:
            fileExt = 'local';
    }
    let path = pathUtil.resolve(__dirname, '../../../', '', `.env.${fileExt}`);

    dotenv.config({ path });
    Object.assign(envOptions, dotenv.parse(await fs.readFileSync(path)));
};

export { loadConfig, envOptions };