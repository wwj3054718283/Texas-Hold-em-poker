import Card from './Card.js';

// 一副牌 类
//  feat:继承 数组 所有 属性
export default class CardList extends Array {
    // -------------一.工具函数-------------
    // 1.生成指定随机整数
    //  feat:lower：最小数 upper：最大数 forbidNum：禁止数
    randomInt(lower, upper, forbidNum = false) {
        // a.随机生成数字 其区间在[lower, upper]
        let ranNum = lower + Math.floor(Math.random() * (upper - lower + 1));
        // b.如果 不存在 禁用数字，则直接返回
        if (!forbidNum) return ranNum

        // c.如果存在 禁用数字，则 在随机数==禁用数字时，重新生成随机数
        while (ranNum == forbidNum) {
            ranNum = lower + Math.floor(Math.random() * (upper - lower + 1))
        }
        // d.返回 不等于 禁用数字的 随机数
        return ranNum;
    }

    // -------------二.业务函数-------------
    // 1.构造函数：初始化一副牌
    // feat: withking 双王
    constructor(withKing = true) {
        // feat:ES6 要求，子类的构造函数必须执行一次super函数
        super()
        // 1.1 牌数组
        // this.cardList = []
        // 1.2 生成一副牌
        let cardName; // 临时变量：存牌全名 '♥A'
        let card; // 临时变量：存 牌对象 new Card
        // 1.3 循环4次，相当于四个花色 (红桃，黑桃，方块，梅花)
        for (let typeEng in Card.Type) {
            // feat：保存花色值，用来获取花色图表
            let typeIndex = Card.Type[typeEng]
            // 1.4 循环获取 数字牌名（1-A）
            for (let num in Card.NumPower) {
                // a.获取牌花（"♥"）
                cardName = Card.TypeImg[typeIndex]
                // b.创建牌
                card = new Card(typeIndex, num, `${cardName}${num}`)
                // c.加入 牌数组
                this.push(card)
            }
        }
        // 1.4 加入大小王
        if (withKing) {
            this.push(new Card(99, 'BK', '大王'))
            this.push(new Card(100, 'SK', '小王'))
        }
    }

    // 2.洗牌（排序洗牌太低效,这里使用取出随机位置2的牌插入到随机位置1）
    // feat：times 每张牌 平均 洗到的 次数
    shuffle(times = 3) {
        // 2.1 准备2个随机位置
        let rNum1 = 0;
        let rNum2 = 0;
        let rCard2 = null; // 随机位置2对应的牌

        for (let i = 1; i <= this.length * times; i++) {
            // a.获取 随机牌 下标
            rNum1 = this.randomInt(0, this.length - 1)
            rNum2 = this.randomInt(0, this.length - 1, rNum1)
            // feat:console.log("随机数1：",rNum1,"随机数2：",rNum2);
            // b.将 rNum2 下标的 牌 放到 rNum1下标牌 后面
            // ['a','b','c'].splice(2,1)
            // feat:取出原数组下标为 rNum2 的一张牌 原数组长度 -1
            rCard2 = this.splice(rNum2, 1)
            // feat:console.log(i,"随机位置2对应的牌:",rCard2);
            // ['a','b','c'].splice(2,0,'x')
            // feat：将取出的牌 插入到下标为 rNum1 的位置 原数组长度 +1
            this.splice(rNum1, 0, ...rCard2)
        }
    }

    // 3.随机生成一张牌
    getACard() {
        // 取出并返回一张牌
        return this.pop()
    }
}
// feat:测试
// let b = new CardList()
// b.shuffle()
// console.log(b);
// console.log(b.getACard());
// console.log(CardList.randomInt);