// 0.导入 并 创建 nodejs 的 控制台读取输入 功能对象
// import readline from 'readline-sync'

// readline.setDefaultOptions({ jzDisplay: true })

// // 1.追加 readLine 方法
// console.readLine = function (msg, options) {
//     return readline.question(msg, options)
// }

// console.readLine = require('prompt-sync')();
// import prompt from 'prompt-sync'
// console.readLine = prompt();

// 导入 逐行读取 
import readline from 'readline';
// 1.生成要读取文件的 interface
const rl = readline.createInterface({
    // 监听的 可读流
    input: process.stdin,
    // 将 逐行读取 的数据 写入 可写流
    output: process.stdout
});

// 2.追加 readLine 方法 
// msg:提示语 answer:键入数据信息
console.readLine = function (msg) {
    // 返回一个 Promise对象 
    return new Promise((suc, fal) => {
        rl.question(msg, (answer) => {
            suc(answer)
        });
    })
    // 不管Promise的结果如何 都会执行finally()
    .finally(() => {
        // rl.close();
    })
}


// 3.追加 readNum 方法
console.readNum = async function (msg) {
    return new Promise((suc, fal) => {
        rl.question(msg, (answer) => {
            suc(answer)
        });
    }).finally(() => {
        rl.close();
    })
}

console.readNum2 = async function (msg) {
    return new Promise((suc, fal) => {
        rl.question(msg, async (answer) => {
            // 将内容转成数字
            let num = Number(answer)
            if (isNaN(num)) {
                console.log('必须输入数字！')
                num = await console.readNum(msg)
            } else suc(answer)
        });
    }).finally(() => {
        rl.close();
    })
}
// 测试
// console.log(console);


// -------------------------JamesZou---------------------
// import inquirer from 'inquirer'
// console.readLine2 = async function (msg, defaultVal, proName = 'usrInput') {
//     return await inquirer.prompt([
//         {
//             type: "input",
//             message: msg,
//             name: proName,
//             default: defaultVal
//         }
//     ])
// }

