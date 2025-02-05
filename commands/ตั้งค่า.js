const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    name: '!ตั้งค่า',
    description: 'การตั้งค่าบอท',
    async execute(message, args, client) {
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('change-token')
                    .setLabel('เปลี่ยนโทเค่น')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('bot-info')
                    .setLabel('ข้อมูลบอท')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('leave-server')
                    .setLabel('ออกจากเซิฟเวอร์')
                    .setStyle(ButtonStyle.Danger)
            );

        const ping = client.ws.ping; // ความปิงของบอท

        const embed = {
            color: 0x0099ff,
            title: '⚙️ การตั้งค่าบอท',
            description: 'เลือกการตั้งค่าที่ต้องการ:',
            image: {
                url: 'https://img2.pic.in.th/pic/01-42-31-422_512bcccf383d1e404c4.gif' // เพิ่ม GIF ขนาดเล็ก
            },
            footer: {
                text: `Ping: ${ping}ms`
            }
        };

        await message.reply({
            embeds: [embed],
            components: [row]
        });
    }
};

