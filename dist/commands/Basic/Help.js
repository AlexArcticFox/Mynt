import Command from "../../command/Command";
import { Basic } from "../../Groups";
import { MessageEmbed } from "discord.js";
import CommandRegistry from "../../command/CommandRegistry";
export default class Help extends Command {
    constructor() {
        super({ name: "Help", triggers: ["help", "commands", "cmds"], description: "Displays all my commands", group: Basic });
    }
    async run(event) {
        const client = event.client;
        const author = event.author;
        const member = event.member;
        const guild = event.guild;
        const mod = await client.isMod(member, guild);
        const help = new MessageEmbed()
            .setTitle("Here's the list of all my commands")
            .setColor("#61e096")
            .setFooter(`Requested by ${author.tag}`, author.displayAvatarURL());
        CommandRegistry.groups.forEach((group) => {
            if (group.ownerOnly && !client.isOwner(event.author)) {
                return;
            }
            else if (group.adminOnly && !client.isAdmin(member)) {
                return;
            }
            else if (group.modOnly && !mod) {
                return;
            }
            const commands = group.commands.map((command) => `${command.name} (\`${command.triggers.join("`,`")}\`) -> ${command.description}`);
            if (commands.length === 0) {
                return;
            }
            help.addField(group.name, commands.join("\n"));
        });
        event.send({ embed: help });
    }
}
//# sourceMappingURL=Help.js.map