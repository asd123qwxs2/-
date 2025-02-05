const { Client } = require('discord.js-selfbot-v13');
const Discord = require('discord.js-selfbot-v13')
const meoaw = require("meoaw.js");
const client = new Client({

    checkUpdate: false

});

// Token

token = "MTE0Mzc0MTg4NTA5ODI1MDI4MQ.G5lgsn.fn3jVSrBdvA-8Z4VlT-zvMFMGHHp1lIqJY_AJU"

link = "https://www.youtube.com/watch?v=0HQZQjC-76o" // ลิ้งค์คริปยูทูป

m_b = "https://cdn.discordapp.com/attachments/1111200766175227945/1117029533359542312/IMG_1255.jpg" // ลิ้งค์รูปใหญ่

m_i = "https://cdn.discordapp.com/attachments/1111200766175227945/1117028829349822514/1134-verified-animated.gif" // ไอคอนเล็กๆ ใส่อิโมจิเคลื่อนไหวได้ !

let options = {
  timeZone: 'Asia/Bangkok',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  hour12: false
};

client.on('ready', async () => {

  console.clear()

  console.log(" ")

  console.log(`${client.user.username} is online !`);

  console.log(" ")

  var lasttime = getTime();

  const r = new Discord.RichPresence()
	.setApplicationId('1094687374484721784')
	.setType('STREAMING')
  .setName('MeoawHub')
	.setURL(`${link}`)
	.setDetails(`${getDate()} ${getTime()}`)
  .setAssetsLargeImage(`${m_b}`) // เปลี่ยนได้ เอารูปใหญ่มาใส่ ขนาด 512 x 512 ใส่ลิ้งค์รูปได้เลยขับ
  .setAssetsSmallImage(`${m_i}`) // เปลี่ยนได้ เอาอิโมจิเคลื่อนไหวมาใส่ หาได้จาก https://emoji.gg/ อัพลงดิสและเอาลิ้งค์มาใส่นะครับ
	.addButton('Discord', 'https://discord.gg/meoaw') // เปลี่ยนได้ อันนี้ข้างหน้าเป็นชื่อปผุ่ม ข้างหลังเป็นลิ้งค์ สามารถเพิ่มอีกได้ 2 อันนะครับด้วยการพิม .addButton('Test', 'https://youtube.com/')
  client.user.setActivity(r);

  meoaw.host();

})

function getDate() {
  return new Date().getDate() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getFullYear();
}

function getTime() {
  return (new Date()).toLocaleString([], options).split(" ")[1].replaceAll(",", "");
}

client.login(`${token}`); // ห้ามเปลี่ยน ตั้งค่าได้ที่บรรทัด 11ใส่โทเคนใน "" ไม่ใช่ใส่ข้างนอก "" นะครับ