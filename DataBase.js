const fs = require('fs');

//Онлайн хранилеще базы данных
let dataBase = {};

//Загрузка Данных СЕРВЕРА из папки
const loadDate = ()=>{
    console.info("[LOAD] Идёт проверка...")
    if(!fs.existsSync(__dirname +"/Data/data.json")){//Если Даннные сервера существуют => Загрузить
        console.info("[LOAD] База данных не была найдена")
        console.info("[LOAD] Происходит загрузка...")
        let data = { database: {} };
        if (fs.existsSync(__dirname +"/Data/data.json")) {
            data = JSON.parse(fs.readFileSync("/Data/data.json").toString());
        }
        dataBase = data.database;
        dataBase.user = {};
    }else{ // Иначе => Создать базу и загрузить её
        console.info("[LOAD] База данных была найдена ")
        console.info("[LOAD] Происходит загрузка...")
        let data = {};
        data = JSON.parse(fs.readFileSync(__dirname +"/Data/data.json").toString());
        dataBase = data.database;

        console.info("[LOAD] Загрузка завершина");
    }
    return console.log("[LOAD] Данные загружены и готовы к использованию")
};

// Сохранение базы данных
const saveDatabase = ()=>{
    console.info("[SAVE] Происходит сахронение данных...");
    fs.writeFileSync(__dirname +"/Data/data.json", JSON.stringify({ database: dataBase }, null, 4));
    console.info("[SAVE] Загрузка завершина")
    process.exit();
};

const getDatabase = () =>{// Geter Базы Серера
    return dataBase;
};




//Экспортируем функции
module.exports = {
    loadDate,
    saveDatabase,
    getDatabase,
};