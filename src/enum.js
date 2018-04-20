module.exports = (app)=>{
    app.enum = {};
    app.enum.cardNumbers = {
        "A":"A",
        2:2,
        3:3,
        4:4,
        5:5,
        6:6,
        7:7,
        8:8,
        9:9,
        10:10,
        J:'J',
        Q:'Q',
        K:'K'
    }
    app.enum.suits = {
        D:'D',
        H:'H',
        C:'C',
        S:'S'
    }
}