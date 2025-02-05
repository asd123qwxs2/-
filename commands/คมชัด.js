const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const fs = require('fs');

module.exports = {
  name: 'enhanceimage',
  description: 'Upscale images to 4k quality',
  aliases: ['upscale', 'sharpen'],
  cooldown: 3,
  async execute(message, args) {
    // สร้างปุ่มเพิ่มภาพ
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('upload_image')
        .setLabel('เพิ่มภาพ')
        .setStyle('Primary')
    );

    // ส่งข้อความและปุ่มให้ผู้ใช้คลิก
    const sentMessage = await message.reply({
      content: 'กรุณากดปุ่มเพื่อเพิ่มภาพที่ต้องการเพิ่มความคมชัด!',
      components: [row],
    });

    // ฟังการตอบกลับจากปุ่ม
    const filter = (interaction) => interaction.user.id === message.author.id;
    const collector = sentMessage.createMessageComponentCollector({ filter, time: 15000 });

    collector.on('collect', async (interaction) => {
      if (interaction.customId === 'upload_image') {
        await interaction.deferUpdate(); // รอการอัปเดตปุ่ม

        // ส่ง Embed พร้อม GIF และฟอร์มกรอก URL
        await interaction.followUp({
          content: 'กรุณากรอกลิงก์ของรูปภาพที่ต้องการเพิ่มความคมชัด:',
          embeds: [
            new EmbedBuilder()
              .setTitle('กรุณากรอก URL ของภาพ!')
              .setDescription('กรุณากรอกลิงก์ URL ของภาพที่ต้องการเพิ่มความคมชัดด้านล่าง:')
              .setColor(0x00AE86)
              .setThumbnail('https://cdn.pixabay.com/animation/2022/09/28/13/39/13-39-31-176_512.gif') // เพิ่ม GIF
          ],
        });

        // รอข้อความตอบกลับจากผู้ใช้
        const messageFilter = (m) => m.author.id === interaction.user.id;
        const collected = await message.channel.awaitMessages({
          filter: messageFilter,
          max: 1,
          time: 30000, // รอ 30 วินาที
          errors: ['time'],
        });

        const userMessage = collected.first();
        const imageURL = userMessage.content;

        if (!imageURL) {
          return interaction.followUp('ไม่พบลิงก์ภาพ! กรุณากรอกลิงก์ภาพอีกครั้ง');
        }

        // ทำการเพิ่มความคมชัด
        try {
          const res = await axios.get(encodeURI(`https://nams.live/upscale.png?{"image":"${imageURL}","model":"4x-UltraSharp"}`), {
            responseType: 'stream',
          });

          const path = `tmp_${Date.now()}.png`;
          const writer = fs.createWriteStream(path);
          res.data.pipe(writer);

          // รอจนกว่าจะเสร็จ
          await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
          });

          // ส่งภาพที่ผ่านการเพิ่มความคมชัด
          await interaction.followUp({
            content: 'การเพิ่มความคมชัดเสร็จสิ้น! 😊',
            files: [{ attachment: path, name: 'enhanced.png' }],
            embeds: [
              new EmbedBuilder()
                .setTitle('ภาพที่เพิ่มความคมชัดแล้ว!')
                .setDescription('ขอบคุณที่ใช้บริการเพิ่มความคมชัดครับ!')
                .setColor(0x00AE86) // สีเขียว
                .setFooter({ text: 'บอทคมชัด' })
                .setThumbnail('https://cdn.pixabay.com/animation/2022/09/28/13/39/13-39-31-176_512.gif') // เพิ่ม GIF ตกแต่ง
            ]
          });

          // ลบไฟล์ชั่วคราว
          fs.unlinkSync(path);
        } catch (e) {
          interaction.followUp('เกิดข้อผิดพลาดในการเพิ่มความคมชัด!');
          console.error(e);
        }
      }
    });

    collector.on('end', () => {
      // ปิดปุ่มหลังจากเวลาผ่านไป 15 วินาที
      sentMessage.edit({
        content: 'หมดเวลาการเลือกเพิ่มภาพ',
        components: [],
      });
    });
  },
};
