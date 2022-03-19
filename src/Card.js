// 一张牌 类
export default class Card {
    // -------------一.初始化数据-------------
    // 1.牌数据
    static NumPower = {
        "2": 1,
        "3": 2,
        "4": 3,
        "5": 4,
        "6": 5,
        "7": 6,
        "8": 7,
        "9": 8,
        "10": 9,
        "J": 10,
        "Q": 11,
        "K": 12,
        "A": 13
    }
    // 2.牌花(红桃，黑桃，梅花，方块)
    static Type = {
        // 红桃
        'Heart': 0,
        // 黑桃
        'Spade': 1,
        // 梅花
        'Club': 2,
        // 方块
        'Diamond': 3,
        // fix
        // '0':'红桃',
        // '1':'黑桃',
        // '2':'梅花',
        // '3':'方块',
    }
    // 3.牌花图标： http://cn.piliapp.com/symbol/
    static TypeImg = ["♥", "♠", "♣", "♦"];

    // ------------构造函数-------------------
    constructor(type, num, name) {
        this.type = type // 牌型：红桃
        this.num = num   // 牌数：K
        this.name = name // 牌面 '红桃K'
        //  fix:this.name = Card.Type[type] + num + '' // 牌面 '红桃K'
        this.cardPower = Card.NumPower[this.num] // 牌力
    }

    toString() {
        return this.name
    }

}
//  feat:测试
// console.log(new Card(0,'Q','红桃Q').toString());
// const Q = new Card(0,'Q')
// console.log(Q.toString(),Q.cardPower);
// console.log(Card.Type);