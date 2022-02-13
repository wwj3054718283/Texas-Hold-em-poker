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


import readline from 'readline'
// 生成要读取文件的 interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// 2.追加 readLine 方法
console.readLine = function (msg) {
    return new Promise((suc, fal) => {
        rl.question(msg, (answer) => {
            suc(answer)
        });
    }).finally(() => {
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

