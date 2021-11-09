/** Rule for Yahtzee scoring.
 *
 * This is an "abstract class"; the real rules are subclasses of these.
 * This stores all parameters passed into it as properties on the instance
 * (to simplify child classes so they don't need constructors of their own).
 *
 * It contains useful functions for summing, counting values, and counting
 * frequencies of dice. These are used by subclassed rules.
 */

class Rule {
  constructor(params) {
    // put all properties in params on instance
    Object.assign(this, params);
  }

  sum(dice) {
    // sum of all dice
    return dice.reduce((prev, curr) => prev + curr);
  }

  freq(dice) {
    // frequencies of dice values
    const freqs = new Map();
    for (let d of dice) freqs.set(d, (freqs.get(d) || 0) + 1);
    return Array.from(freqs.values());
  }

  count(dice, val) {
    // # times val appears in dice
    return dice.filter(d => d === val).length;
  }
}

/** Given a sought-for val, return sum of dice of that val.
 *
 * Used for rules like "sum of all ones"
 */

class TotalOneNumber extends Rule {
  evalRoll = dice => {
    return this.val * this.count(dice, this.val);
  };
}

/** Given a required # of same dice, return sum of all dice.
 *
 * Used for rules like "sum of all dice when there is a 3-of-kind"
 */

class SumDistro extends Rule {
  evalRoll = dice => {
    // do any of the counts meet of exceed this distro?
    return this.freq(dice).some(c => c >= this.count) ? this.sum(dice) : 0;
  };
}

/** Check if full house (3-of-kind and 2-of-kind) */
// with an array like [1,2,2,1,2]
class FullHouse extends Rule{
  evalRoll = (dice) => {
    const freqs = this.freq(dice);
    return (freqs.includes(2) && freqs.includes(3)) ? this.score : 0;
  }
  
}

/** Check for small straights. */
// 1234, 2345, 3456, check for four in a row, only 3 options
class SmallStraight extends Rule {
  // define evalRoll here and then create set object to make it easy to chck if a given value is present.
  evalRoll = (dice) => {
    const d = new Set(dice);
    // straight can be 234 and either 1 or 5
    if (d.has(2) && d.has(3) && d.has(4) && (d.has(1) || d.has(5)))
      return this.score

    // or check for 345 and either 2 or 6
    if (d.has(3) && d.has(4) && d.has(5) && (d.has(2) || d.has(6)))
      return this.score;
    return 0;
  }
}

/** Check for large straights. */
// extends the base abstract Rule class, thats why we dont need constructor in each of our classes below
class LargeStraight extends Rule {
  evalRoll = dice => {
    const d = new Set(dice);

    // large straight must be 5 different dice & only one can be a 1 or a 6
    return d.size === 5 && (!d.has(1) || !d.has(6)) ? this.score : 0;
  };
}

/** Check if all dice are same. */

class Yahtzee extends Rule {
  evalRoll = dice => {
    // all dice must be the same
    return this.freq(dice)[0] === 5 ? this.score : 0;
  };
}

// testing testing testing here is something I want to check on git changes
// on november 8 2021, i accidently did a git init on the src folder, when I did git init in the parent folder yahtzee-starter aswell, then added a remote repository to push to. it pushed verything but the src folder becuase it saw that as a seperate folder. so, i had to delete the git directory i created there with this command, rm -rf .git, then it worked fine. 
// ones, twos, etc score as sum of that value
const ones = new TotalOneNumber({ val: 1, description: "1 point per 1" });
const twos = new TotalOneNumber({ val: 2, description: "2 points per 2" });
const threes = new TotalOneNumber({ val: 3, description: "3 points per 3" });
const fours = new TotalOneNumber({ val: 4, description: "4 points per 4" });
const fives = new TotalOneNumber({ val: 5, description: "5 points per 5" });
const sixes = new TotalOneNumber({ val: 6, description: "6 points per 6" });

// three/four of kind score as sum of all dice
const threeOfKind = new SumDistro({ count: 3, description: "sum all dice if 3 are the same" });
const fourOfKind = new SumDistro({ count: 4, description: "sum all dice if 4 are the same" });

// full house scores as flat 25
const fullHouse = new FullHouse({score: 25, description: "25 points for a full house"});

// small/large straights score as 30/40
const smallStraight = new SmallStraight({score: 30, description: "30 points for a small straight"});
const largeStraight = new LargeStraight({ score: 40, description: "40 points for a large straight" });

// yahtzee scores as 50
const yahtzee = new Yahtzee({ score: 50, description: "50 points for yahtzee" });

// for chance, can view as some of all dice, requiring at least 0 of a kind
const chance = new SumDistro({ count: 0, description: "sum of all dice" });

export {
  ones,
  twos,
  threes,
  fours,
  fives,
  sixes,
  threeOfKind,
  fourOfKind,
  fullHouse,
  smallStraight,
  largeStraight,
  yahtzee,
  chance
};
