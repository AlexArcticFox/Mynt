import Event from "@event/Event";
import MyntClient from "~/MyntClient";
import { Message, MessageEmbed, TextChannel } from "discord.js";
import { autoMod } from "@utils/Automod";

export default class MessageEvent extends Event {
    public constructor() {
        super({ name: "message" });
    }

    public async callback(client: MyntClient, message: Message): Promise<void> {
        try {
            if (message.author.bot) {
                return;
            }

            if (!message.guild && !message.author.bot) {
                client.lastDmAuthor = message.author;
                await generateMail(client, message);
                return;
            }

            if (!message.guild) {
                return;
            }

            const guild = await client.database?.getGuild(message.guild.id);
            if (!guild) {
                return;
            }

            if (guild.config.automod) {
                autoMod(client, message, guild);
            }
        } catch (error) {
            client.emit("error", error);
        }
    }
}

async function generateMail(client: MyntClient, message: Message): Promise<void> {
    const author = message.author;
    const received = new MessageEmbed()
        .setTitle(author.username)
        .setDescription(message)
        .setColor("#61e096")
        .setFooter("ID: " + author.id, author.displayAvatarURL());
    if (message.attachments && message.attachments.first()) {
        received.setImage(message.attachments.first()?.url as string);
    }

    const channel = client.channels.cache.find(channel => channel.id == client.config.mail);

    if (channel) {
        await (channel as TextChannel).send({ embed: received });
    }
}
