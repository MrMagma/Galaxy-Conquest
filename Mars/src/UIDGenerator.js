var UIDGenerator = (function() {
    
    let alphaNumeric = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k",
        "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y",
        "z", /* Now I know my ABCs. */ "0", "1", "2", "3", "4", "5", "6", "7",
        "8", "9"];
    
    class UIDGenerator {
        constructor(cfg = {}) {
            let {alphabet = alphaNumeric, sequenceLength = 10} = cfg;
            this.alphabet = alphabet;
            this.sequenceLength = sequenceLength;
        }
        generate(sequenceLength = this.sequenceLength) {
            let uid = "";
            while (uid.length < sequenceLength) {
                uid += this.randomChar();
            }
            return uid;
        }
        randomChar() {
            return this.alphabet[Math.floor(Math.random() * this.alphabet.length)];
        }
    }
    
    module.exports = UIDGenerator;
    return UIDGenerator;
    
})();
