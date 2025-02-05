const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: '!สร้างรูป',
    description: 'สร้างรูปภาพจาก Pollinations API',
    async execute(message, args, client) {
        const query = args.join(" ");
        if (!query) {
            return message.reply("กรุณากรอกคำที่ต้องการสร้างรูป เช่น `!สร้างรูป sunset`");
        }

        const cacheDir = path.join(__dirname, '..', 'cache');
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir);
        }
        const filePath = path.join(cacheDir, 'poli.png');

        try {
            const response = await axios.get(`https://image.pollinations.ai/prompt/${encodeURIComponent(query)}`, {
                responseType: "arraybuffer",
            });

            fs.writeFile(filePath, response.data, (err) => {
                if (err) {
                    console.error("Error writing file:", err);
                    return message.reply("❌ เกิดข้อผิดพลาดในการบันทึกรูป");
                }

                message.channel.send({
                    content: "✅ สร้างรูปเสร็จเรียบร้อยแล้ว ✅ จะถูกลบหลังจาก 1 ชั่วโมง!! 🥳",
                    files: [filePath]
                }).then(() => {
                    setTimeout(() => {
                        fs.unlink(filePath, (err) => {
                            if (err) console.error("ไม่สามารถลบไฟล์ได้:", err);
                        });
                    }, 3600000);
                });
            });
            
        } catch (error) {
            console.error("Error generating image:", error);
            message.reply("❌ เกิดข้อผิดพลาดในการสร้างรูป ❌ กรุณาลองใหม่อีกครั้ง");
        }
    }
};
