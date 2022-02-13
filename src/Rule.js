import Card from './Card.js'
import Player from './Player.js'

// 牌型筛选类
class Grand {
    // 牌型数据
    static Types = {
        royalFlush: 10, // 皇家同花顺:由5张 花色相同A K Q J 10 组成
        straightFlush: 9, // 同花顺:由5张 连张同花色的牌组成
        fourOfAKind: 8, // 四条(4带1)
        fullHouse: 7, // 葫芦(3带2)
        flush: 6, // 同花: 5张牌花色相同，但不构成顺子
        straight: 5, // 顺子: 5张牌连张，至少1张花色不同
        threeOfAKind: 4, // 三条: 3张牌点值相同，其他2张各异
        twoPair: 3, // 两对: 2对加上一个杂牌
        onePair: 2, // 一对: 1对加上3张杂牌
        highCard: 0 // 高牌:5张单牌
    }

    constructor(type, cards) {
        this.type = type // 牌型
        this.typeName = Grand.getGrandName(type) // 牌型名称
        // 显示用
        this.cards = cards // 完整牌组(5张)= 配型牌组 + 落单牌组
        // 区分以用来算牌力
        this.grandCards = [] // 配型牌组
        this.highCards = [] // 落单牌组
    }

    // 返回牌型名称
    static getGrandName(typeNum) {
        switch (typeNum) {
            case 10: return '皇家同花顺'
            case 9: return '同花顺'
            case 8: return '四条'
            case 7: return '葫芦'
            case 6: return '同花'
            case 5: return '顺子'
            case 4: return '三条'
            case 3: return '两对'
            case 2: return '一对'
            case 0: return '高牌'
            default: return '非法类型'
        }
    }

    // 牌型分数，级别 * 100
    getPower() {
        return this.type * 10000
    }
}

// 导出规则(德州扑克)
export default class Rule {
    constructor() {
        this.name = "test"
    }

    // 1.计算牌型(Grand - 同花顺，四条....共10种)--------------------------
    calPower(player) {
        // a.获取牌型 和 选中的 最高分牌
        player.grand = this.calGrandType(player.mixCards)
        // b.计算 牌力
        player.power = this.calPlayerPower(player)

        // let testPlayer = new Player('测试玩家1')
        // testPlayer.mixCards = Rule.TestCards.straight4.cards
        // testPlayer.cards = Rule.TestCards.straight4.playerCards
        // testPlayer.grand = this.calGrandType(testPlayer.mixCards)
        // testPlayer.power = this.calPlayerPower(testPlayer)
        // // console.log('grandType-> ', testPlayer)

        // console.log('-------' + testPlayer.name + '-------')
        // let cardsStr = testPlayer.showTheCards(testPlayer.grand.cards)
        // let str = `牌力:${testPlayer.power} 牌型:${testPlayer.grand.typeName} \t ${cardsStr} \n`
        // console.log(str)

        // console.log(testPlayer.grand.cards)
    }

    // 2.计算牌型(grand)，返回 牌型对象(type,cards)------------------------
    calGrandType(mixCards) {
        // 符合条件的牌：
        let selectedCards = []

        // a.先标记为【1_高牌】 --------------------------------------
        //  
        let grandType = {
            royalFlush: [false, new Grand(Grand.Types.royalFlush)], // 皇家同花顺:由5张 花色相同A K Q J 10 组成
            straightFlush: [false, new Grand(Grand.Types.straightFlush)], // 同花顺:由5张 连张同花色的牌组成
            fourOfAKind: [false, new Grand(Grand.Types.fourOfAKind)], // 四条(4带1)
            fullHouse: [false, new Grand(Grand.Types.fullHouse)], // 葫芦(3带2)
            flush: [false, new Grand(Grand.Types.flush)], // 同花: 5张牌花色相同，但不构成顺子
            straight: [false, new Grand(Grand.Types.straight)], // 顺子: 5张牌连张，至少1张花色不同
            threeOfAKind: [false, new Grand(Grand.Types.threeOfAKind)], // 三条: 3张牌点值相同，其他2张各异
            twoPair: [false, new Grand(Grand.Types.twoPair)], // 两对: 2对加上一个杂牌
            onePair: [false, new Grand(Grand.Types.onePair)], // 一对: 1对加上3张杂牌
            highCard: [false, new Grand(Grand.Types.highCard)] // 高牌:5张单牌
        }

        // b.【2_同花】【3同花顺】【4_皇家同欢顺】 -------------------
        // 遍历4种牌花，从7张中筛选牌花一样的牌组，如果数量=5，则有同花
        for (let card_type_key in Card.Type) {
            // 取出 一种花色
            let card_type = Card.Type[card_type_key]
            // 查询 同花色的牌
            selectedCards = mixCards.filter(c => c.type === card_type)
            // 如果有5张同花色的牌，则为 同花
            if (selectedCards.length === 5) {
                grandType.flush[0] = true // 同花
                grandType.flush[1].grandCards = [...selectedCards] // 保存 配型牌组
                grandType.flush[1].cards = [...selectedCards] // 保存 选中牌

                // 【3_同花顺】如果同花牌 是顺子 ---------------------
                let samePowerCount = 0
                for (let i = 0; i < selectedCards.length - 1; i++) {
                    // 顺子：有5张牌 后面的 和 前面的牌力 相等，如：KQJ109,但不含4321A
                    if (selectedCards[i].cardPower - selectedCards[i + 1].cardPower === 1) {
                        // 累加 前后牌 符合条件的次数
                        samePowerCount++
                    }
                }
                // 如果 第一张 和 最后一张牌 是 A 和 2，也+1：针对 4321A
                if (selectedCards[0].cardPower === 13 && selectedCards[4].cardPower === 1) {
                    samePowerCount++
                }
                if (samePowerCount >= 4) {
                    grandType.straightFlush[0] = true // 同花顺 KQJ 10 9
                    grandType.straightFlush[1].grandCards = [...selectedCards] // 保存 配型牌组
                    grandType.straightFlush[1].cards = [...selectedCards] // 保存 选中牌
                } else if (samePowerCount >= 3) { // 5432A

                }

                // 【5_皇家同欢顺】:如果 第一张为A--------------------
                if (selectedCards[0].num == 'A' && selectedCards[4].num == '10') {
                    grandType.royalFlush[0] = true // 皇家同欢顺
                    grandType.royalFlush[1].grandCards = [...selectedCards] // 保存 配型牌组
                    grandType.royalFlush[1].cards = [...selectedCards] // 保存 选中牌
                }
            }
            break // 如果找到了同花，则退出循环
        }

        // 如果是 同花顺，则 直接 返回 牌型，如果只是同花，还需要继续执行
        if (grandType.royalFlush[0]) {
            // 设置 牌型名称
            grandType.royalFlush[1].typeName = Grand.getGrandName(grandType.royalFlush[1].type)
            return grandType.royalFlush[1]
        }
        else if (grandType.straightFlush[0]) {
            // 设置 牌型名称
            grandType.straightFlush[1].typeName = Grand.getGrandName(grandType.straightFlush[1].type)
            return grandType.straightFlush[1]
        }

        // c.顺子(普通顺子) -------------------------------------------
        // 清空 符合条件的牌 数组
        selectedCards = []

        for (let i = 0; i < mixCards.length - 1; i++) {
            // 顺子：有5张牌 前后牌力 相等的牌
            if (mixCards[i].cardPower - mixCards[i + 1].cardPower === 1) {
                // 当选中只有 3张时，把前面一张 加入数组
                if (selectedCards.length < 3) {
                    // 将 前后 顺牌 添加到 数组中，i++
                    selectedCards.push(mixCards[i])
                } else { // 当选中有3张时，则把 第4张和第5张 加入数组
                    selectedCards.push(mixCards[i], mixCards[i + 1])
                }
            }
            // 如果已经找到5张顺子了，则退出循环，防止后面还有 小的连牌
            if (selectedCards.length === 5) break
        }

        // console.log('-------------selectedCards-------------')
        // console.log(selectedCards)
        // console.log('-------------selectedCards-------------')

        // 如果 有4张连牌，且 最后一张是2，则判断mixCards中是否有 A =================
        if (selectedCards.length === 4 && selectedCards[3].cardPower === 1 && mixCards[0].cardPower === 13) {
            // 将A加到选中顺排数组
            selectedCards.push(mixCards[0])
        }

        // 【4_普通顺子】-------------------------------------
        // 如果有5张牌符合条件，是 普通顺子,且：能走到这来，已经不是同花顺了
        if (selectedCards.length >= 5) {
            // c1.【4_普通顺子】-------------------------------------
            grandType.straight[0] = true // 普通顺子
            grandType.straight[1].grandCards = [...selectedCards] // 保存 选中牌
            grandType.straight[1].cards = selectedCards // 保存 选中牌
        }

        // d.【6_四条】【7_三条】【8_葫芦】【9_一对】【10_双对】 ----
        for (let i = 0; i < mixCards.length; i++) {
            // 取出 当前牌
            let curCard = mixCards[i]
            // 获取 数字 相同的牌数量
            selectedCards = mixCards.filter(c => c.num === curCard.num)

            if (selectedCards.length === 4) { //4四条
                // 再找出 剩余里面 最大的一个牌
                let restMaxOne = this.findMax(mixCards, 1, selectedCards)

                grandType.fourOfAKind[0] = true // 四条
                grandType.fourOfAKind[1].grandCards = [...selectedCards]  // 保存 配型牌组
                grandType.fourOfAKind[1].highCards = [...restMaxOne] // 保存 落单牌组

                selectedCards.push(...restMaxOne) // 将剩下的最大的一个牌 加入 选中数组
                grandType.fourOfAKind[1].cards = selectedCards // 保存 选中牌
                break
            }
            else if (selectedCards.length === 3) { //葫芦/三条
                // e.【9_葫芦】3带2 --------------------------------
                let pair = this.findPair(mixCards, selectedCards)
                if (pair) {
                    grandType.fullHouse[0] = true // 5葫芦
                    grandType.fullHouse[1].grandCards = [...selectedCards]  // 保存 配型牌组
                    grandType.fullHouse[1].highCards = [...pair] // 保存 落单牌组

                    selectedCards.push(...pair) // 将找出剩下的一对牌 加入 选中数组
                    grandType.fullHouse[1].cards = selectedCards // 保存 选中牌
                }
                else {
                    // 找出剩余牌中 最大的两张牌
                    pair = this.findMax(mixCards, 2, selectedCards)

                    grandType.threeOfAKind[0] = true // 5三条
                    grandType.threeOfAKind[1].grandCards = [...selectedCards]  // 保存 配型牌组
                    grandType.threeOfAKind[1].highCards = [...pair] // 保存 落单牌组

                    selectedCards.push(...pair) // 将找出剩下的两张单牌 加入 选中数组
                    grandType.threeOfAKind[1].cards = selectedCards // 保存 选中牌
                }
                break
            } else if (selectedCards.length === 2) { // 双对/单对
                // 【双对】找出另一对
                let pair = this.findPair(mixCards, selectedCards)
                if (pair) {
                    selectedCards.push(...pair)
                    let lastOne = this.findMax(mixCards, 1, selectedCards)
                    grandType.twoPair[0] = true // 9双对
                    grandType.twoPair[1].grandCards = [...selectedCards]  // 保存 配型牌组
                    grandType.twoPair[1].highCards = [...lastOne] // 保存 落单牌组

                    selectedCards.push(...lastOne) // 将找出另一对加入到 选中牌组
                    grandType.twoPair[1].cards = selectedCards // 保存 选中牌
                }
                else {
                    // 【单对】在剩余牌中找出3张最大牌
                    let last3Card = this.findMax(mixCards, 3, selectedCards)
                    grandType.onePair[0] = true // 10一对
                    grandType.onePair[1].grandCards = [...selectedCards]  // 保存 配型牌组
                    grandType.onePair[1].highCards = [...last3Card] // 保存 落单牌组

                    selectedCards.push(...last3Card) // 将找出的剩下3张 加入 选中数组
                    grandType.onePair[1].cards = selectedCards // 保存 选中牌
                }
            }
        }

        // console.log('++++++++++++++++++++++++++++++++++++++')
        // console.log(grandType)
        // console.log('++++++++++++++++++++++++++++++++++++++')

        // f.根据 牌型牌力大小，返回 符合的 最大牌型-----------------
        // 由于 遍历时，按照对象 中 属性的 先后顺序，由大牌
        for (let key in grandType) {
            //取出牌型数组 -> [true,new Grand(type,typeName,cards)]
            let typeArr = grandType[key]
            if (typeArr[0]) {
                // 设置 牌型名称
                typeArr[1].typeName = Grand.getGrandName(typeArr[1].type)
                return typeArr[1] // return Grand
            }
        }

        // e.【10_单牌】如果能执行到这，说明前面9中牌型都未匹配，是为单牌
        grandType.highCard[0] = true
        // 找出5张单牌
        grandType.highCard[1].cards = this.findMax(mixCards, 5)
        grandType.highCard[1].grandCards = grandType.highCard[1].cards  // 保存 配型牌组
        // 设置 牌型名称
        grandType.highCard[1].typeName = Grand.getGrandName(grandType.highCard[1].type)
        return grandType.highCard[1]
    }

    // 2.1 大到小排序后的cards中 前n张单牌（不含excludeCards牌） ----------
    findMax(cards, targetNum = 1, excludeCards = []) {
        // 排除 cards 中 与 excludeCards 相同的牌
        cards = cards.filter(c => !excludeCards.some(x => x.name === c.name))

        // 找到的牌
        let one = []
        // 在剩下的牌中找最大张牌
        for (let i = 0; i < targetNum; i++) {
            one.push(cards[i])
        }

        return one
    }

    // 2.2 在 cards 中找 对牌（不包含excludeCards中的牌）------------------
    findPair(cards, excludeCards) {
        // 排除 cards 中 与 excludeCards 相同的牌
        excludeCards && (cards = cards.filter(c => !excludeCards.some(x => x.name === c.name)))

        // 找到的对子
        let pairs = null
        // 在剩下的牌中找对子
        for (let i = 0; i < cards.length; i++) {
            // 取出 当前牌
            let curCard = cards[i]
            // 获取 数字 相同的牌数量（排除当前牌）
            pairs = cards.filter(c => c.num === curCard.num)
            // 如果 是一对
            if (pairs.length === 2) {
                return pairs
            }
        }

        return pairs.length % 2 === 2 ? pairs : null
    }

    // 3.计算玩家牌力,返回牌力值-------------------------------------------
    // 规则：牌型*10000 + 组牌*1000 + 剩余单牌
    calPlayerPower(player) {
        let power = 0
        // 牌组中的 牌分值 系数1000 -----------
        player.grand.grandCards.forEach(c => {
            power += c.cardPower * 100
        })
        // 剩余牌 分值 系数1 -----------
        player.grand.highCards.forEach(c => {
            power += c.cardPower
        })

        // 牌组中的 牌 排序
        player.grand.grandCards.sort((p, n) => n.cardPower - p.cardPower)
        // 剩余牌 排序
        player.grand.highCards.sort((p, n) => n.cardPower - p.cardPower)

        return player.grand.getPower() + power
    }

    // 测试 牌组
    static TestCards = {
        royalFlush: { // 10皇家同花顺:由5张 花色相同A K Q J 10 组成
            cards: [
                { type: 0, num: 'A', name: '♥A', cardPower: 13 },
                { type: 0, num: 'K', name: '♥K', cardPower: 12 },
                { type: 0, num: 'Q', name: '♥Q', cardPower: 11 },
                { type: 0, num: 'J', name: '♥J', cardPower: 10 },
                { type: 0, num: '10', name: '♥10', cardPower: 9 },
                { type: 1, num: '2', name: '♠2', cardPower: 1 },
                { type: 3, num: '2', name: '♠2', cardPower: 1 }
            ],
            playerCards: [
                { type: 0, num: 'Q', name: '♥Q', cardPower: 11 },
                { type: 0, num: 'J', name: '♥J', cardPower: 10 }
            ]
        },
        straightFlush: { // 9同花顺:由5张 连张同花色的牌组成
            cards: [
                { type: 2, num: '12', name: '♦K', cardPower: 12 },
                { type: 0, num: '12', name: '♥K', cardPower: 12 },
                { type: 0, num: '11', name: '♥Q', cardPower: 11 },
                { type: 0, num: '10', name: '♥J', cardPower: 10 },
                { type: 0, num: '9', name: '♥10', cardPower: 9 },
                { type: 0, num: '8', name: '♥9', cardPower: 8 },
                { type: 1, num: '1', name: '♠2', cardPower: 1 },
            ],
            playerCards: [
                { type: 0, num: '10', name: '♥J', cardPower: 10 },
                { type: 0, num: '9', name: '♥10', cardPower: 9 },
            ]
        },
        straightFlush2: { // 9同花顺:由5张 连张同花色的牌组成
            cards: [
                { type: 0, num: '13', name: '♥A', cardPower: 13 },
                { type: 1, num: '6', name: '♠6', cardPower: 5 },
                { type: 0, num: '5', name: '♥5', cardPower: 4 },
                { type: 0, num: '4', name: '♥4', cardPower: 3 },
                { type: 0, num: '3', name: '♥3', cardPower: 2 },
                { type: 0, num: '2', name: '♥2', cardPower: 1 },
                { type: 1, num: '2', name: '♠2', cardPower: 1 },
            ],
            playerCards: [
                { type: 0, num: '13', name: '♥A', cardPower: 13 },
                { type: 0, num: '5', name: '♥5', cardPower: 4 },
            ]
        },
        fourOfAKind: { // 8四条(4带1)
            cards: [
                { type: 0, num: 'A', name: '♥A', cardPower: 13 },
                { type: 2, num: 'A', name: '♦A', cardPower: 13 },
                { type: 1, num: 'A', name: '♠A', cardPower: 13 },
                { type: 3, num: 'A', name: '♣A', cardPower: 13 },
                { type: 3, num: 'K', name: '♣K', cardPower: 12 },
                { type: 0, num: 'J', name: '♥J', cardPower: 10 },
                { type: 1, num: '2', name: '♠2', cardPower: 1 }
            ],
            playerCards: [
                { type: 3, num: 'A', name: '♣A', cardPower: 13 },
                { type: 3, num: 'K', name: '♣K', cardPower: 12 },
            ]
        },
        fourOfAKind2: { // 8四条(4带1)
            cards: [
                { type: 3, num: 'K', name: '♣K', cardPower: 12 },
                { type: 0, num: 'J', name: '♥J', cardPower: 10 },
                { type: 1, num: '5', name: '♠5', cardPower: 4 },
                { type: 0, num: '2', name: '♥2', cardPower: 1 },
                { type: 2, num: '2', name: '♦2', cardPower: 1 },
                { type: 1, num: '2', name: '♠2', cardPower: 1 },
                { type: 3, num: '2', name: '♣2', cardPower: 1 }
            ],
            playerCards: [
                { type: 1, num: '5', name: '♠5', cardPower: 4 },
                { type: 0, num: '2', name: '♥2', cardPower: 1 },
            ]
        },
        fullHouse: { // 7葫芦(3带2)
            cards: [
                { type: 0, num: 'A', name: '♥A', cardPower: 13 },
                { type: 1, num: 'J', name: '♠J', cardPower: 10 },
                { type: 2, num: 'J', name: '♦J', cardPower: 10 },
                { type: 3, num: 'J', name: '♣J', cardPower: 10 },
                { type: 0, num: '8', name: '♥8', cardPower: 7 },
                { type: 2, num: '8', name: '♦8', cardPower: 7 },
                { type: 1, num: '2', name: '♠2', cardPower: 1 }
            ],
            playerCards: [
                { type: 3, num: 'J', name: '♣J', cardPower: 10 },
                { type: 0, num: '8', name: '♥8', cardPower: 7 },
            ]
        },
        fullHouse1: { // 7葫芦(3带2)
            cards: [
                { type: 0, num: 'A', name: '♥A', cardPower: 13 },
                { type: 1, num: 'A', name: '♠A', cardPower: 13 },
                { type: 2, num: 'A', name: '♦A', cardPower: 13 },
                { type: 3, num: 'K', name: '♣K', cardPower: 12 },
                { type: 0, num: 'K', name: '♥K', cardPower: 12 },
                { type: 2, num: '8', name: '♦8', cardPower: 7 },
                { type: 1, num: '2', name: '♠2', cardPower: 1 }
            ],
            playerCards: [
                { type: 0, num: 'K', name: '♥K', cardPower: 12 },
                { type: 2, num: '8', name: '♦8', cardPower: 7 },
            ]
        },
        fullHouse2: { // 7葫芦(3带2)
            cards: [
                { type: 2, num: '8', name: '♦8', cardPower: 7 },
                { type: 1, num: '5', name: '♠5', cardPower: 4 },
                { type: 3, num: 'K', name: '♣3', cardPower: 2 },
                { type: 0, num: 'K', name: '♥3', cardPower: 2 },
                { type: 0, num: '2', name: '♥2', cardPower: 1 },
                { type: 1, num: '2', name: '♠2', cardPower: 1 },
                { type: 2, num: '2', name: '♦2', cardPower: 1 }
            ],
            playerCards: [
                { type: 3, num: 'K', name: '♣3', cardPower: 2 },
                { type: 2, num: '8', name: '♦8', cardPower: 7 },
            ]
        },
        flush: { // 6同花: 5张牌花色相同，但不构成顺子
            cards: [
                { type: 2, num: '10', name: '♦10', cardPower: 9 },
                { type: 0, num: '10', name: '♥10', cardPower: 9 },
                { type: 0, num: '6', name: '♥6', cardPower: 5 },
                { type: 0, num: '5', name: '♥5', cardPower: 4 },
                { type: 0, num: '4', name: '♥4', cardPower: 3 },
                { type: 0, num: '3', name: '♥3', cardPower: 2 },
                { type: 1, num: '2', name: '♠2', cardPower: 1 }
            ],
            playerCards: [
                { type: 0, num: '4', name: '♥4', cardPower: 3 },
                { type: 1, num: '2', name: '♠2', cardPower: 1 }
            ]
        },
        flush1: { // 6同花 最大: 5张牌花色相同，但不构成顺子
            cards: [
                { type: 0, num: 'A', name: '♥A', cardPower: 13 },
                { type: 0, num: 'K', name: '♥K', cardPower: 12 },
                { type: 0, num: 'Q', name: '♥Q', cardPower: 11 },
                { type: 0, num: 'J', name: '♥J', cardPower: 10 },
                { type: 0, num: '9', name: '♥9', cardPower: 8 },
                { type: 1, num: '2', name: '♠2', cardPower: 1 },
                { type: 3, num: '2', name: '♠2', cardPower: 1 }
            ],
            playerCards: [
                { type: 0, num: 'J', name: '♥J', cardPower: 10 },
                { type: 0, num: '9', name: '♥9', cardPower: 8 },
            ]
        },
        flush2: { // 6同花 最小: 5张牌花色相同，但不构成顺子
            cards: [
                { type: 0, num: '7', name: '♥7', cardPower: 6 },
                { type: 0, num: '6', name: '♥6', cardPower: 5 },
                { type: 0, num: '5', name: '♥5', cardPower: 4 },
                { type: 1, num: '5', name: '♠5', cardPower: 4 },
                { type: 0, num: '4', name: '♥4', cardPower: 3 },
                { type: 0, num: '2', name: '♥2', cardPower: 1 },
                { type: 1, num: '2', name: '♠2', cardPower: 1 }
            ],
            playerCards: [
                { type: 0, num: '4', name: '♥4', cardPower: 3 },
                { type: 0, num: '2', name: '♥2', cardPower: 1 },
            ]
        },
        straight: {// 5顺子: 5张牌连张，至少1张花色不同
            cards: [
                { type: 2, num: '10', name: '♦10', cardPower: 9 },
                { type: 2, num: '7', name: '♦7', cardPower: 6 },
                { type: 0, num: '6', name: '♥6', cardPower: 5 },
                { type: 1, num: '5', name: '♠5', cardPower: 4 },
                { type: 3, num: '4', name: '♣4', cardPower: 3 },
                { type: 0, num: '3', name: '♥3', cardPower: 2 },
                { type: 1, num: '3', name: '♠3', cardPower: 2 },
            ],
            playerCards: [
                { type: 2, num: '10', name: '♦10', cardPower: 9 },
                { type: 3, num: '4', name: '♣4', cardPower: 3 },
            ]
        },
        straight1: {// 5顺子 最大：5张牌连张，至少1张花色不同
            cards: [
                { type: 1, num: 'A', name: '♠A', cardPower: 13 },
                { type: 0, num: 'K', name: '♥K', cardPower: 12 },
                { type: 0, num: 'Q', name: '♥Q', cardPower: 11 },
                { type: 0, num: 'J', name: '♥J', cardPower: 10 },
                { type: 0, num: '10', name: '♥10', cardPower: 9 },
                { type: 1, num: '2', name: '♠2', cardPower: 1 },
                { type: 1, num: '2', name: '♠2', cardPower: 1 }
            ],
            playerCards: [
                { type: 0, num: 'J', name: '♥J', cardPower: 10 },
                { type: 0, num: '10', name: '♥10', cardPower: 9 },
            ]
        },
        straight2: {// 5顺子 测试乱牌
            cards: [
                { type: 0, num: '13', name: '♥A', cardPower: 13 },
                { type: 1, num: '7', name: '♠7', cardPower: 6 },
                { type: 0, num: '5', name: '♥5', cardPower: 4 },
                { type: 2, num: '4', name: '♦4', cardPower: 3 },
                { type: 3, num: '3', name: '♣3', cardPower: 2 },
                { type: 0, num: '2', name: '♥2', cardPower: 1 },
                { type: 1, num: '2', name: '♠2', cardPower: 1 },
            ],
            playerCards: [
                { type: 2, num: '4', name: '♦4', cardPower: 3 },
                { type: 3, num: '3', name: '♣3', cardPower: 2 },
            ]
        },
        straight3: {// 5顺子: 5张牌连张，至少1张花色不同
            cards: [
                { type: 2, num: 'Q', name: '♦Q', cardPower: 11 },
                { type: 2, num: 'J', name: '♦J', cardPower: 10 },
                { type: 0, num: '10', name: '♥10', cardPower: 9 },
                { type: 1, num: '9', name: '♠9', cardPower: 8 },
                { type: 3, num: '8', name: '♣8', cardPower: 7 },
                { type: 0, num: '3', name: '♥3', cardPower: 2 },
                { type: 1, num: '2', name: '♠2', cardPower: 1 },
            ],
            playerCards: [
                { type: 1, num: '9', name: '♠9', cardPower: 8 },
                { type: 3, num: '8', name: '♣8', cardPower: 7 },
            ]
        },
        straight4: {// 5顺子: 5张牌连张，至少1张花色不同
            cards: [
                { type: 2, num: 'K', name: '♦K', cardPower: 12 },
                { type: 2, num: 'Q', name: '♦Q', cardPower: 11 },
                { type: 0, num: 'J', name: '♥J', cardPower: 10 },
                { type: 1, num: '3', name: '♠3', cardPower: 2 },
                { type: 0, num: '3', name: '♥3', cardPower: 2 },
                { type: 3, num: '2', name: '♣2', cardPower: 1 },
                { type: 1, num: '2', name: '♠2', cardPower: 1 },
            ],
            playerCards: [
                { type: 0, num: 'J', name: '♥J', cardPower: 10 },
                { type: 1, num: '3', name: '♠3', cardPower: 2 },
            ]
        },
        threeOfAKind: { //4三条: 3张牌点值相同，其他2张各异
            cards: [
                { type: 0, num: 'J', name: '♥J', cardPower: 10 },
                { type: 1, num: 'J', name: '♠J', cardPower: 10 },
                { type: 2, num: 'J', name: '♦J', cardPower: 10 },
                { type: 3, num: '10', name: '♣10', cardPower: 9 },
                { type: 0, num: '5', name: '♥5', cardPower: 4 },
                { type: 2, num: '8', name: '♦8', cardPower: 7 },
                { type: 1, num: '2', name: '♠2', cardPower: 1 }
            ],
            playerCards: [
                { type: 2, num: 'J', name: '♦J', cardPower: 10 },
                { type: 3, num: '10', name: '♣10', cardPower: 9 },
            ]
        },
        threeOfAKind1: { //4三条 最大: 3张牌点值相同，其他2张各异
            cards: [
                { type: 0, num: 'J', name: '♥A', cardPower: 13 },
                { type: 1, num: 'J', name: '♠A', cardPower: 13 },
                { type: 2, num: 'J', name: '♦A', cardPower: 13 },
                { type: 3, num: 'K', name: '♣K', cardPower: 12 },
                { type: 0, num: 'Q', name: '♥Q', cardPower: 11 },
                { type: 2, num: '8', name: '♦8', cardPower: 7 },
                { type: 1, num: '2', name: '♠2', cardPower: 1 }
            ],
            playerCards: [
                { type: 2, num: 'J', name: '♦A', cardPower: 13 },
                { type: 3, num: 'K', name: '♣K', cardPower: 12 },
            ]
        },
        threeOfAKind2: { //4三条 最小: 3张牌点值相同，其他2张各异
            cards: [
                { type: 2, num: '7', name: '♦7', cardPower: 6 },
                { type: 0, num: '6', name: '♥6', cardPower: 5 },
                { type: 1, num: '5', name: '♠5', cardPower: 4 },
                { type: 3, num: '4', name: '♣4', cardPower: 3 },
                { type: 0, num: '2', name: '♥2', cardPower: 1 },
                { type: 1, num: '2', name: '♠2', cardPower: 1 },
                { type: 2, num: '2', name: '♦2', cardPower: 1 }
            ],
            playerCards: [
                { type: 2, num: '2', name: '♦2', cardPower: 1 },
                { type: 3, num: '3', name: '♣3', cardPower: 2 },
            ]
        },
        twoPair: { // 3两对: 2对加上一个杂牌
            cards: [
                { type: 0, num: 'A', name: '♥A', cardPower: 13 },
                { type: 1, num: 'J', name: '♠J', cardPower: 10 },
                { type: 2, num: 'J', name: '♦J', cardPower: 10 },
                { type: 3, num: '10', name: '♣10', cardPower: 9 },
                { type: 0, num: '5', name: '♥5', cardPower: 4 },
                { type: 2, num: '5', name: '♦5', cardPower: 4 },
                { type: 1, num: '2', name: '♠2', cardPower: 1 }
            ],
            playerCards: [
                { type: 0, num: 'A', name: '♥A', cardPower: 13 },
                { type: 0, num: '5', name: '♥5', cardPower: 4 },
            ]
        },
        twoPair1: { // 3两对 最大: 2对加上一个杂牌
            cards: [
                { type: 0, num: 'A', name: '♥A', cardPower: 13 },
                { type: 1, num: 'A', name: '♠A', cardPower: 13 },
                { type: 2, num: 'K', name: '♦K', cardPower: 12 },
                { type: 3, num: 'K', name: '♣K', cardPower: 12 },
                { type: 0, num: 'Q', name: '♥Q', cardPower: 11 },
                { type: 2, num: '5', name: '♦5', cardPower: 4 },
                { type: 1, num: '2', name: '♠2', cardPower: 1 }
            ],
            playerCards: [
                { type: 3, num: 'K', name: '♣K', cardPower: 12 },
                { type: 0, num: 'Q', name: '♥Q', cardPower: 11 },
            ]
        },
        twoPair2: { // 3两对 最大: 2对加上一个杂牌
            cards: [
                { type: 2, num: '6', name: '♦6', cardPower: 5 },
                { type: 1, num: '5', name: '♠5', cardPower: 4 },
                { type: 0, num: '4', name: '♥4', cardPower: 3 },
                { type: 2, num: '3', name: '♦3', cardPower: 12 },
                { type: 3, num: '3', name: '♣3', cardPower: 12 },
                { type: 0, num: '2', name: '♥2', cardPower: 13 },
                { type: 1, num: '2', name: '♠2', cardPower: 13 },
            ],
            playerCards: [
                { type: 3, num: '3', name: '♣3', cardPower: 12 },
                { type: 0, num: '4', name: '♥4', cardPower: 11 },
            ]
        },
        onePair: { // 2一对: 1对加上3张杂牌
            cards: [
                { type: 0, num: 'A', name: '♥A', cardPower: 13 },
                { type: 1, num: 'J', name: '♠J', cardPower: 10 },
                { type: 2, num: 'J', name: '♦J', cardPower: 10 },
                { type: 3, num: '10', name: '♣10', cardPower: 9 },
                { type: 0, num: '5', name: '♥5', cardPower: 4 },
                { type: 2, num: '4', name: '♦4', cardPower: 3 },
                { type: 1, num: '2', name: '♠2', cardPower: 1 }
            ],
            playerCards: [
                { type: 2, num: 'J', name: '♦J', cardPower: 10 },
                { type: 2, num: '4', name: '♦4', cardPower: 3 },
            ]
        },
        onePair1: { // 2一对 最大: 1对加上3张杂牌
            cards: [
                { type: 0, num: 'A', name: '♥A', cardPower: 13 },
                { type: 1, num: 'A', name: '♠A', cardPower: 13 },
                { type: 2, num: 'K', name: '♦K', cardPower: 12 },
                { type: 3, num: 'Q', name: '♣Q', cardPower: 11 },
                { type: 0, num: 'J', name: '♥J', cardPower: 10 },
                { type: 2, num: '4', name: '♦4', cardPower: 3 },
                { type: 1, num: '2', name: '♠2', cardPower: 1 }
            ],
            playerCards: [
                { type: 3, num: 'Q', name: '♣Q', cardPower: 11 },
                { type: 0, num: 'J', name: '♥J', cardPower: 10 },
            ]
        },
        onePair2: { // 2一对 最小: 1对加上3张杂牌
            cards: [
                { type: 0, num: '8', name: '♥8', cardPower: 7 },
                { type: 1, num: '7', name: '♠7', cardPower: 6 },
                { type: 2, num: '6', name: '♦6', cardPower: 5 },
                { type: 3, num: '5', name: '♣5', cardPower: 4 },
                { type: 0, num: '3', name: '♥3', cardPower: 2 },
                { type: 2, num: '2', name: '♦2', cardPower: 1 },
                { type: 1, num: '2', name: '♠2', cardPower: 1 }
            ],
            playerCards: [
                { type: 3, num: '5', name: '♣5', cardPower: 4 },
                { type: 0, num: '3', name: '♥3', cardPower: 2 },
            ]
        },
        highCard: { // 1高牌:5张单牌
            cards: [
                { type: 0, num: 'A', name: '♥A', cardPower: 13 },
                { type: 1, num: 'Q', name: '♠Q', cardPower: 11 },
                { type: 2, num: 'J', name: '♦J', cardPower: 10 },
                { type: 3, num: '8', name: '♣8', cardPower: 7 },
                { type: 0, num: '5', name: '♥5', cardPower: 4 },
                { type: 2, num: '4', name: '♦4', cardPower: 3 },
                { type: 1, num: '2', name: '♠2', cardPower: 1 }
            ],
            playerCards: [
                { type: 2, num: 'J', name: '♦J', cardPower: 10 },
                { type: 3, num: '8', name: '♣8', cardPower: 7 },
            ]
        },
        Test(grandName) {
        }
    }
}

