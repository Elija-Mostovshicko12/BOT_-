const { Client, Intents, MessageEmbed} = require('discord.js');
const QIWI = require("@qiwi/bill-payments-node-js-sdk")
let SQ_token = 'sec_key_QIWI'
const qiwiApi = new QIWI(SQ_token)
const fs = require('fs');
const bot = new Client({ intents: [Intents.FLAGS.GUILDS] });
let token = process.env.BOT_TOKEN || 'токен бота';
bot.login(token);
const DB = require('./DataBase.js')

// остановка событий (выключение)
process.on("SIGINT", ()=>{
    console.log("[END]Завершение процесов...");
    DB.saveDatabase();// Сохраняем базу данных
})


const days_role = '972944733427085432';
const vip_role = '788745907801161748';
let prise = []



bot.on('ready',() => {
    DB.loadDate()
    check()
    console.info(`[Console] ${bot.user.tag} готов к работе`);
    bot.user.setActivity('подсчете золотых', { type: 'COMPETING' })
    prise = DB.getDatabase().prise
    some_hour()
})


function check() {
    let ser = bot.guilds.cache.get('665186853044879372');
    let dats = DB.getDatabase().user
    for(let i = 0; i < Object.values(dats).length; i++){
        let now = new Date();
        if(Object.values(dats)[i].endDate !== "inf"){
            if (now.getTime() > Number(Object.values(dats)[i].endDate)) {

                let gu_mem = ser.members.cache.find(m => m.id == Object.keys(dats)[i]);
                console.log(`[CHECK_SYS] У пользователя с ником: ${gu_mem.nickname} закончилась подписка`)
                gu_mem.roles.remove(days_role).catch((err)=>{console.log(err)})
                DB.getDatabase().user[Object.keys(dats)[i]] = {}
            }
        }
    }
}


function some_hour(){
    setInterval(()=>{
        check();
    },3600000)
}



bot.on('message', (msg) =>{
    if(msg.author.bot) return
    const prefix = '+'
    const commandBody = msg.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();
    if(msg.channel.type == 'dm'){
        if(command === 'buy'){
            const form = new MessageEmbed()
                .setColor('#001eff')
                .addFields({ name:'Вы написали команду +buy', value:`Здраствуйте! выберите прайз введя команду после символа ' | '  \n\nПрайсы:\n проходка на 7 дней\t 100руб | +7day \n проходка на 30 дней\t 250руб | +30day \n vip (навегда)\t 300руб | +vip`})
            msg.author.send(form)
        }
        if(command === '7day'){


            const QIWISettings = {
                amount: prise[0], // Сумма, пока оставим null
                billId: qiwiApi.generateId(), // Идентификатор платежа (он у каждого будет уникальный)
                comment: "Проходка на 7 дней", // Комментарий
                currency: "RUB" // Валюта
            }
            if(!DB.getDatabase().user[msg.author.id]) {
                DB.getDatabase().user[msg.author.id] = {}
            }
            DB.getDatabase().user[msg.author.id].billId = QIWISettings.billId;
            DB.getDatabase().user[msg.author.id].prise = '7day'
            qiwiApi.createBill(QIWISettings.billId, QIWISettings).then(data => { // Выставляем счет, передаем billId и другие данные
                const form = new MessageEmbed()
                    .setColor('#001cff')
                    .addFields({ name:'Вы выбрали прайс на 7 дней', value:`ваша ссылка на оплату: ${data.payUrl}\n Она будет действовать 10 мин`})
                msg.author.send(form)
                gg(DB.getDatabase().user[msg.author.id], msg.author)
            })

        }
        if(command === '30day'){


            const QIWISettings = {
                amount: prise[1], // Сумма, пока оставим null
                billId: qiwiApi.generateId(), // Идентификатор платежа (он у каждого будет уникальный)
                comment: "Проходка на 30 дней", // Комментарий
                currency: "RUB" // Валюта
            }
            if(!DB.getDatabase().user[msg.author.id]) {
                DB.getDatabase().user[msg.author.id] = {}
            }
            DB.getDatabase().user[msg.author.id].billId = QIWISettings.billId;
            DB.getDatabase().user[msg.author.id].prise = '30day'
            qiwiApi.createBill(QIWISettings.billId, QIWISettings).then(data => { // Выставляем счет, передаем billId и другие данные
                const form = new MessageEmbed()
                    .setColor('#001cff')
                    .addFields({ name:'Вы выбрали прайс на 30 дней', value:`ваша ссылка на оплату: ${data.payUrl}\n Она будет действовать 10 мин`})
                msg.author.send(form)
                gg(DB.getDatabase().user[msg.author.id], msg.author)
            })

        }
        if(command === 'vip'){


            const QIWISettings = {
                amount: prise[2], // Сумма, пока оставим null
                billId: qiwiApi.generateId(), // Идентификатор платежа (он у каждого будет уникальный)
                comment: "vip", // Комментарий
                currency: "RUB" // Валюта
            }
            if(!DB.getDatabase().user[msg.author.id]) {
                DB.getDatabase().user[msg.author.id] = {}
            }
            DB.getDatabase().user[msg.author.id].billId = QIWISettings.billId;
            DB.getDatabase().user[msg.author.id].prise = 'vip'
            qiwiApi.createBill(QIWISettings.billId, QIWISettings).then(data => { // Выставляем счет, передаем billId и другие данные
                const form = new MessageEmbed()
                    .setColor('#001cff')
                    .addFields({ name:'Вы выбрали прайс vip', value:`ваша ссылка на оплату: ${data.payUrl}\n Она будет действовать 10 мин`})
                msg.author.send(form)
                gg(DB.getDatabase().user[msg.author.id], msg.author)
            })

        }
    }
})





function gg(data, U) {
    let ser = bot.guilds.cache.get('665186853044879372');
    let a = 0;
    let f = setInterval(()=>{
        if(a >= 600){
            clearInterval(f);
            qiwiApi.cancelBill(data.billId);
        }
        qiwiApi.getBillInfo(data.billId).then((data)=>{
            if(data.status.value == "PAID"){
                console.log(`[BUY_SYS] участник ${U.nickname} совершил покупку прайса: ${data.prise}`);
                let now = new Date();
                let end = new Date();
                if (data.prise === "7day") {
                    end.setHours(168 + now.getHours());
                    DB.getDatabase().user[U.id].endDate = 0
                    DB.getDatabase().user[U.id].endDate = end.getTime();
                }
                if (data.prise === "30day") {
                    end.setHours(720 + now.getHours());
                    DB.getDatabase().user[U.id].endDate = 0
                    DB.getDatabase().user[U.id].endDate = end.getTime();
                }
                if (data.prise === "vip") {
                    DB.getDatabase().user[U.id].endDate = 'inf';
                }


                let gu_mem = ser.members.cache.find(m => m.id == U.id);
                if (data.prise === "7day") {
                    gu_mem.roles.add(days_role).catch((err)=>{console.log(err)});
                }
                if (data.prise === "30day") {
                    gu_mem.roles.add(days_role).catch((err)=>{console.log(err)});
                }
                if (data.prise === "vip") {
                    gu_mem.roles.add(vip_role).catch((err)=>{console.log(err)});
                }
                const form = new MessageEmbed()
                    .setColor('#57ff00')
                    .setTitle("Ваша оплата прошла успешна")
                gu_mem.send(form)
                clearInterval(f);
            }else{
            }
        })
        a++
    }, 1000)
}