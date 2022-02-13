// 游戏界面类
export default class GameView {
    constructor(gameControl) {
        // 创建游戏对象
        this.game = gameControl
    }

    // 1.欢迎词-----------------
    welcome() {
        console.log("*********************************************************");
        console.log("*                                                       *");
        console.log("*【学】    【习】   【使】    【我】    【快】    【乐】*");
        console.log("*                                                       *");
        console.log("*********************************************************");
    }

    // 2.接收用户数量和名字------
    async initPlayers() {
        // a.接收玩家数量
        this.playerNum = await console.readLine('请输入玩家数量(3-5名):')
        // b.接收玩家姓名
        let pName = ''
        for (let i = 0; i < this.playerNum; i++) {
            // 接收玩家名字
            pName = await console.readLine(`请输入【第${i + 1}位】玩家昵称:`)
            // 添加 玩家
            this.game.addPlayer(pName)
        }
        // console.log(this.game.players)
    }

    // 3.显示指定用户指定的牌----
    showAPlayerCard(pIndex) {
        this.game.players[pIndex].cards
    }

}