import Event from "@event/Event";
import MyntClient from "~/MyntClient";
import { unban, unmute } from "@utils/Utils";

export default class Ready extends Event {
    public constructor() {
        super({ name: "ready" });
    }

    public async callback(client: MyntClient): Promise<void> {
        console.log(`Logged in as ${client.user?.tag}`);
        client.user?.setActivity("with Alex", { type: "PLAYING" });

        const database = client.database;
        const cursor = database.infractions.find({ complete: false, end: { "$lt": Date.now() + 24 * 60 * 60 } });

        client.infractions = (await cursor.toArray()).map(({ _id, action, guild, user, end = 0 }) => {
            return { _id, action, guild, user, end };
        });

        client.interval = client.setInterval(() => {
            const indexes = [] as number[];
            client.infractions.forEach((infraction, index) => {
                if (infraction.end! <= Date.now() + 200) {
                    // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
                    switch (infraction.action) {
                        case "Ban": {
                            unmute(client, infraction.guild, infraction.user);
                            break;
                        }
    
                        case "Mute": {
                            unban(client, infraction.guild, infraction.user);
                            break;
                        }
                    }
    
                    client.database.infractions.updateOne({ _id: infraction._id }, { "complete": true });
                    indexes.push(index);
                }
            });
    
            indexes.sort((a, b) => b - a).forEach((index) => {
                client.infractions.splice(index, 1);
            });
        }, 1000);
    }
}
