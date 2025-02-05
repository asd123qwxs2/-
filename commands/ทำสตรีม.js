const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const meoaw = require("meoaw.js");

let token = "";
let stream_url = "https://www.twitch.tv/your_channel"; // URL สตรีมของคุณ (เช่น Twitch)
let m_b = "https://cdn.discordapp.com/attachments/1111200766175227945/1117029533359542312/IMG_1255.jpg"; // ลิ้งค์รูปใหญ่
let m_i = "https://cdn.discordapp.com/attachments/1111200766175227945/1117028829349822514/1134-verified-animated.gif"; // ไอคอนเล็กๆ

module.exports = {
    name: '!เริ่มสตรีม',
    async execute(message) {
        // สร้างปุ่มให้กดเลือกกรอกโทเค่น
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('enterToken')
                .setLabel('📋 กรอกโทเค่น')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('startStream')
                .setLabel('🎥 เริ่มสตรีม')
                .setStyle(ButtonStyle.Danger)
        );

        // ส่งข้อความให้ผู้ใช้เลือก
        await message.reply({
            content: 'กรุณากดปุ่มด้านล่างเพื่อทำการตั้งค่าและเริ่มสตรีม:',
            components: [row]
        });

        // ฟังการโต้ตอบจากผู้ใช้
        message.client.on('interactionCreate', async (interaction) => {
            if (!interaction.isButton()) return;

            if (interaction.customId === 'enterToken') {
                // ให้ผู้ใช้กรอกโทเค่น
                const modal = new ModalBuilder()
                    .setCustomId('tokenModal')
                    .setTitle('กรุณากรอกโทเค่น');
                const tokenInput = new TextInputBuilder()
                    .setCustomId('tokenInput')
                    .setLabel('โทเค่นของคุณ')
                    .setStyle(TextInputStyle.Short)
                    .setMaxLength(60);

                modal.addComponents(
                    new ActionRowBuilder().addComponents(tokenInput)
                );

                await interaction.showModal(modal);
            }

            if (interaction.customId === 'startStream') {
                // ตรวจสอบว่าได้กรอกโทเค่นหรือยัง
                if (!token) {
                    return interaction.reply({ content: '❌ กรุณากรอกโทเค่นก่อน!', flags: 64 });
                }

                await interaction.reply({
                    content: '🎬 กำลังเริ่มสตรีม...',
                    flags: 64
                });

                // ทำงานสตรีมต่อไป เช่น การตั้งค่า RichPresence หรือเริ่มสตรีมจริงๆ
                const client = new Client({
                    checkUpdate: false,
                    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] // เพิ่ม intents ที่จำเป็น
                });

                client.on('ready', async () => {
                    console.clear();
                    console.log(`${client.user.username} is online !`);

                    // สร้าง Stream สำหรับ RichPresence
                    const streamStatus = {
                        name: 'กำลังสตรีมเกมสนุกๆ!',
                        url: stream_url
                    };

                    // ตั้งค่า Streaming ให้โปรไฟล์
                    await client.user.setPresence({
                        activities: [{
                            name: streamStatus.name,
                            type: 'STREAMING',
                            url: streamStatus.url,
                            assets: {
                                large_image: m_b,
                                small_image: m_i
                            }
                        }],
                        status: 'online'
                    });
                    await client.login(token); // เข้าสู่ระบบด้วยโทเค่น
                });
            }
        });

        // ฟังการกรอกโทเค่นจาก Modal
        message.client.on('interactionCreate', async (interaction) => {
            if (!interaction.isModalSubmit()) return;

            if (interaction.customId === 'tokenModal') {
                token = interaction.fields.getTextInputValue('tokenInput'); // เก็บโทเค่นในตัวแปร

                await interaction.reply({ content: `✅ โทเค่นของคุณถูกตั้งค่าแล้ว`, flags: 64 });
            }
        });
    }
};
