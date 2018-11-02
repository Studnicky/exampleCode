const IsNan = (value) => {
  //  Look, it's not that I don't trust you, but who really remembers JS typecast rules offhand?
  //  I would probably import a toolkit lib for this, and then extend it with a local lib for whatever needs arise.
  //  Realistically, this sort of input checking belongs in a schema middleware at the API input logic
  return (typeof value !== 'number' || value !== value);
};

//  Wrote these all out as promises because in a more realistic app, I would be fetching data from persistence layers async
//  I have come to actually prefer to promise chain syntax to async
const adjustForAge = (currentValue, age = 0) => {
  //  These values looked like they would be changed by business rules.
  //  I have strong feelings about hardcoding things, ever.  No reason to redeploy.
  //  dot-env config is a rudimentary tool, but this is just an example.
  //  I would probably go for a Jenkins insertion script for prod deployments
  const MAX_AGE_COUNT = process.env.MAX_AGE_COUNT;
  age = parseInt( age, 10 );

  return new Promise((resolve, reject) => {
    if(IsNan(age)) {
      let message = `Unable to estimate value for age: ${age}`;
      reject(new Error(message));
    } else {
      let limitedAge = age <= MAX_AGE_COUNT ? age : MAX_AGE_COUNT;
      let valueAdjustment = -Math.abs(currentValue * limitedAge * 0.005);
      console.log("adjustForAge", valueAdjustment);
      resolve(valueAdjustment);
    }
  });
};

const adjustForMileage = (currentValue, mileage = 0) => {
  const MAX_MILEAGE_COUNT = process.env.MAX_MILEAGE_COUNT;
  mileage = parseInt( mileage, 10 );

  return new Promise((resolve, reject) => {
    if(IsNan(mileage)) {
      let message = `Unable to estimate value for mileage: ${mileage}`;
      reject(new Error(message));
    } else {
      let limitedMiles = mileage <= MAX_MILEAGE_COUNT ? mileage : MAX_MILEAGE_COUNT;
      let valueAdjustment = -Math.abs(currentValue * limitedMiles / 1000 * 0.002);
      console.log("adjustForMileage", valueAdjustment);
      resolve(valueAdjustment);
    }
  });
};

const adjustForOwnerCount = (currentValue, owners = 0) => {
  const MAX_OWNERS_COUNT = process.env.MAX_OWNERS_COUNT;
  owners = parseInt( owners, 10 );

  return new Promise((resolve, reject) => {
    if(IsNan(owners)) {
      let message = `Unable to estimate value for owners: ${owners}`;
      reject(new Error(message));
    } else {
      //  I dislike hoisting, because it leads to unsafe memory practice and breaking block-scope
      //  A transpiler would minify this to an inline ternary before compiling as bytecode anyway
      //  For readability, this is fine - after all, the next guy has to be able to read it
      let valueAdjustment;
      if(owners === 0) {
        valueAdjustment = Math.abs(currentValue * 0.1);
      } else {
        let limitedOwners = owners <= MAX_OWNERS_COUNT ? owners : MAX_OWNERS_COUNT;
        valueAdjustment = -Math.abs(currentValue * limitedOwners * 0.25);
      }
      console.log("adjustForOwnerCount", valueAdjustment);
      resolve(valueAdjustment);
    }
  });
};

const adjustForCollisions = (currentValue, collisions = 0) => {
  const MAX_COLLISIONS_COUNT = process.env.MAX_COLLISIONS_COUNT;
  collisions = parseInt( collisions, 10 );

  return new Promise((resolve, reject) => {
    if(IsNan(collisions)) {
      let message = `Unable to estimate value for collisions: ${collisions}`;
      reject(new Error(message));
    } else {
      let limitedCollisions = collisions <= MAX_COLLISIONS_COUNT ? collisions : MAX_COLLISIONS_COUNT;
      let valueAdjustment = -Math.abs(currentValue * limitedCollisions * 0.02);
      console.log("adjustForCollisions", valueAdjustment);
      resolve(valueAdjustment);
    }
  });
};

const calculateValue = (initialValue, age, mileage, owners, collisions) => {
  //  Modify the memory in a new buffer, leave the initial in place
  let currentValue = initialValue;

  //  Instead of hoisting and using globals, a functional approach to determine new vars
  return adjustForAge(currentValue, age)
  .then((ageReductionValue) => {
    //  Apply changes only to memory that exists in this scope
    currentValue = currentValue + ageReductionValue;
    console.log("adjusted", currentValue);
    return adjustForMileage(currentValue, mileage);
  })
  .then((mileageReductionValue) => {
    currentValue = currentValue + mileageReductionValue;
    console.log("adjusted", currentValue);
    return adjustForOwnerCount(currentValue, owners);
  })

  .then((ownerReductionValue) => {
    //  Order of deductions shifts based on +/- from owners calc
    //  In a more complicated app, these could be abstracted out into facade methods to facilitate cleaner promise chaining
    if(ownerReductionValue >= 0) {

       return adjustForCollisions(currentValue, collisions)
       .then((collisionsReductionValue) => {
         currentValue = currentValue + collisionsReductionValue;
         console.log("adjusted", currentValue);
         currentValue = currentValue + ownerReductionValue;
         console.log("adjusted", currentValue);
        return currentValue;
       });

    } else {

      currentValue = currentValue + ownerReductionValue;
      console.log("adjusted", currentValue);
      return adjustForCollisions(currentValue, collisions)
      .then((collisionsReductionValue) => {
        currentValue = currentValue + collisionsReductionValue;
        console.log("adjusted", currentValue);
       return currentValue;
      });

    }
    //  These variable and method names are long, but the advantage here is that it's readble
    //  This makes code review really simple and allows non-coders to determine exactly what is going on
    //  The breakout also ends up in my stack traces for laser-targeted debugging in dev
    //  A transpiler would shorten the value names for me on deploy anyway.
  })
};

//  The class concept in javascript is just syntax sugar, in reality everything is just an object with methods under the hood.
//  This approach lets me export method collections in namespaces without the lexical 'this'
//  Devs who insist on using that are just introducing layers of complexity in managing their logic.  What for?
module.exports = {
  calculateValue
};
//  Keep the framework logic where the framework cares about it.
//  Because this controller is pure nodejs, I could swap frameworks with it in minutes.
//  Want to do this with graphql? Refactor into a new set of endpoints?  Convert to lambda?  Sure, I gotchu.
