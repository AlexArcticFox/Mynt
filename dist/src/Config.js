"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigHandler_1 = require("../ConfigHandler");
exports.default = {
    token: ConfigHandler_1.string(""),
    prefix: ConfigHandler_1.string("!"),
    owners: ConfigHandler_1.array(ConfigHandler_1.base.string),
    staff: ConfigHandler_1.array(ConfigHandler_1.base.string),
    modlog: ConfigHandler_1.string(""),
    database: ConfigHandler_1.object({
        url: ConfigHandler_1.string(""),
        name: ConfigHandler_1.string(""),
        MongoOptions: ConfigHandler_1.object({
            useNewUrlParser: ConfigHandler_1.string(""),
            useUnifiedTopology: ConfigHandler_1.string("")
        })
    })
};
//# sourceMappingURL=Config.js.map