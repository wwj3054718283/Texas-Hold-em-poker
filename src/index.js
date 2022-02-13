// 0.1 执行工具代码，向 console 添加 readLine 对象
import './utils/tools.js'

// 0.2 导入游戏界面类
import GameControl from "./GameControl.js"
// 创建 游戏控制器 对象
const game = new GameControl()
// a.欢迎
game.gameView.welcome()
// b.添加用户
await game.initPlayers()
// c.玩游戏
game.play()

