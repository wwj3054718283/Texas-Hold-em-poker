import CardList from './CardList.js'
import Player from './Player.js'
import Rule from './Rule.js'
// 0.2 导入游戏界面类
import GameView from "./GameView.js"


export default class GameControl {
    constructor() {
        // a.创建游戏界面实例------------------
        this.gameView = new GameView(this)
        this.cardList = new CardList(false) // 牌
        this.players = [] // 玩家数组
        this.rule = new Rule() // 游戏规则
        this.pubCards = null // 公共牌
    }

    async initPlayers() {
        // c.初始化玩家信息
        await this.gameView.initPlayers()
    }

    // 1.添加 玩家---------------
    addPlayer(name) {
        // 设置默认玩家名称
        // Boolean: 0,NaN , '' , null , undefind -> false
        //          其他的 -> true
        // 变量 = Boolean('') ? 值1 : 值2
        name = name ? name : `玩家${this.players.length + 1}`
        // 创建玩家对象
        let player = new Player(name)
        // 加入玩家数组
        this.players.push(player)
    }

    // 2. 开始游戏(公牌5张，玩家2张/人)----------------
    play() {
        this.playARound()
    }

    // 3.玩一局
    playARound() {
        // a.洗牌，发牌------------------------
        this.cardList.shuffle() // 洗牌
        this.deelPubCard() // 发公共牌
        this.deelAllPlayerCard() // 发玩家牌

        // b.排序
        this.sortCards()

        // c.显示所有公共牌 和 玩家牌
        this.showPubCards()
        this.showPlayerCards()

        // d.比较输赢
        this.judge()
    }

    // 3.1 给玩家发牌--------------
    deelAllPlayerCard() {
        // a.循环玩家数组
        this.players.forEach((p) => {
            // b.调用规则，获取此游戏规则 获取的牌组(如：扎金花返回三张)
            let cards = this.deelPlayerCards(this.cardList)
            // c.将 牌组 设置给 玩家
            p.cards.push(...cards)
            // d.将 玩家牌 和 公共牌组合
            p.mixCards.push(...cards, ...this.pubCards)
        })
    }

    // 3.1.1 生成一位玩家的手牌------
    deelPlayerCards(cardList) {
        let cards = []
        // 从 牌盒中 获取 2张牌
        for (let i = 0; i < 2; i++) {
            cards.push(cardList.getACard())
        }
        return cards
    }

    // 3.2 生成公共牌---------------
    deelPubCard() {
        this.pubCards = this.cardList.splice(0, 5)
    }

    // 4.为 手牌，公共牌，混合手牌 排序-------
    sortCards() {
        // 补充：为了体验更好，不需要对 公共牌和手牌排序
        //       只对 混合手牌排序，目的是为了方便计算牌力
        // a.公共牌 根据牌力做排序(大->小)
        // this.pubCards.sort((pre, next) => next.cardPower - pre.cardPower)

        // b.玩家牌 排序
        this.players.forEach(p => {
            // b1.玩家手牌 根据牌力做排序(大->小)
            // p.cards.sort((pre, next) => next.cardPower - pre.cardPower)
            // b2.玩家混合手牌 根据牌力做排序(大->小)
            p.mixCards.sort((pre, next) => next.cardPower - pre.cardPower)
            // p.mixCards.forEach(c => {
            //     console.log(p.name, c)
            // })
        })
    }

    // 5.显示玩家牌 ----------------
    showPlayerCards(withPubCard = false) {
        withPubCard ?
            this.players.forEach(p => p.showMixCards())
            : this.players.forEach(p => p.showCards())
    }

    // 6.显示公共牌 ----------------
    showPubCards() {
        let s = this.pubCards.reduce((str, p) => {
            return str += p.name + '\t'
        }, '')

        console.log(`公共--> ` + s)
    }

    // 7.比较输赢 ------------------
    judge() {
        // this.rule.calPower(this.players[0])

        this.players.forEach((p) => {
            // p.showMixCards()
            // 计算 每位玩家的 最佳组合牌以及分数
            this.rule.calPower(p)
        })


        this.players.sort((p1, p2) => p2.power - p1.power)

        this.players.forEach(p => {
            console.log('-------' + p.name + '-------')
            let cardsStr = p.showTheCards(p.grand.cards)
            cardsStr += '\n' + p.showTheCards(p.grand.grandCards)
            let str = `牌力:${p.power} 牌型:${p.grand.typeName} \t ${cardsStr} \n`
            console.log(str)
        })

        console.log('【获胜者】：', this.players[0].name)
    }

}