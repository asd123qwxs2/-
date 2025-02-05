const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    name: '!ประกาศ',
    async execute(message, args, botClient) {
        // ดึงข้อมูลเซิร์ฟเวอร์ที่บอทอยู่
        const guilds = botClient.guilds.cache.map(guild => `📌 **${guild.name}** (ID: ${guild.id})`).join("\n");

        if (!guilds) {
            return message.reply("❌ บอทยังไม่ได้เข้าร่วมเซิร์ฟเวอร์ใดเลย");
        }

        // สร้างปุ่มให้กดเพื่อเปิดฟอร์มกรอกข้อมูล
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('open_announcement_modal')
                .setLabel('📢 สร้างประกาศ')
                .setStyle(ButtonStyle.Primary)
        );

        // ส่งรายชื่อเซิร์ฟเวอร์ที่บอทอยู่ พร้อมปุ่ม
        await message.reply({
            content: `✅ **บอทอยู่ในเซิร์ฟเวอร์ดังต่อไปนี้:**\n\n${guilds}`,
            components: [row]
        });

        // ฟังปุ่มกด
        botClient.on('interactionCreate', async interaction => {
            if (!interaction.isButton()) return;
            if (interaction.customId !== 'open_announcement_modal') return;

            // สร้าง Modal สำหรับให้กรอกข้อความประกาศ
            const modal = new ModalBuilder()
                .setCustomId('announcement_modal')
                .setTitle('📢 สร้างประกาศ');

            // ช่องกรอกข้อความ
            const messageInput = new TextInputBuilder()
                .setCustomId('announcement_message')
                .setLabel('📄 ข้อความที่ต้องการประกาศ')
                .setStyle(TextInputStyle.Paragraph);

            // ช่องกรอกจำนวนครั้งที่ต้องการส่ง
            const countInput = new TextInputBuilder()
                .setCustomId('announcement_count')
                .setLabel('🔢 จำนวนครั้งที่ต้องการส่ง')
                .setStyle(TextInputStyle.Short);

            // เพิ่มช่องกรอกลงใน Modal
            modal.addComponents(
                new ActionRowBuilder().addComponents(messageInput),
                new ActionRowBuilder().addComponents(countInput)
            );

            await interaction.showModal(modal);
        });

        // ฟังการส่งฟอร์ม
        botClient.on('interactionCreate', async interaction => {
            if (!interaction.isModalSubmit()) return;
            if (interaction.customId !== 'announcement_modal') return;

            const announcementMessage = interaction.fields.getTextInputValue('announcement_message');
            const announcementCount = parseInt(interaction.fields.getTextInputValue('announcement_count'), 10);

            if (isNaN(announcementCount) || announcementCount <= 0) {
                return interaction.reply({ content: "❌ กรุณากรอกจำนวนที่ถูกต้อง!", ephemeral: true });
            }

            for (let i = 0; i < announcementCount; i++) {
                await interaction.channel.send(`📢 **ประกาศจากบอท:** ${announcementMessage}`);
            }

            await interaction.reply({ content: "✅ ประกาศถูกส่งเรียบร้อย!", ephemeral: true });
        });
    }
};
