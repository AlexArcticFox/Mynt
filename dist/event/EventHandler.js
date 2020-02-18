"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const fs_1 = require("fs");
async function EventHandler(client) {
    const readDir = util_1.promisify(fs_1.readdir);
    const events = await readDir("./dist/events");
    for await (const item of events) {
        const { event } = require(`../events/${item}`);
        client.on(event.name, (...args) => {
            event.func(client, ...args);
        });
    }
}
exports.EventHandler = EventHandler;
//# sourceMappingURL=EventHandler.js.map