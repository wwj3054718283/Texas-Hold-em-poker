// 玩家类
export default class Player {
    constructor(name) {
        this.name = name // 玩家名字
        this.cards = [] // 玩家手牌
        this.mixCards = [] // 组合牌
        this.power = 0 // 牌力值
        this.grand = null // 牌型对象{type,cards}
    }

    // 0.展示指定牌组 字符串
    showTheCards(cardList) {
        if (cardList.length == 0) return '未发牌'

        let str = '\t'

        cardList.forEach((c) => {
            str += c.name + '\t'
        })
        return str
    }

    // 1.展示所有牌花-----------------
    showCards() {
        const res = this.showTheCards(this.cards)
        console.log(`玩家${this.name}-->\t` + res)
        return res
    }

    // 2.展示带公共牌牌花-----------------
    showMixCards() {
        const res = this.showTheCards(this.mixCards)
        console.log(`玩家${this.name}-->\t` + res)
        return res
    }
}