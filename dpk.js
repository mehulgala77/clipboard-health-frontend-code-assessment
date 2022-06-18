const crypto = require("crypto");

// Refactor Reason: It is best to keep all the constants collated at one place 
// so that they are easier to refer back to.
// I typically keep all of them at the top of a source file or at the top of a class definition 
// If they can be reused in other components, it is best to keep them in a separate constant file.
const TRIVIAL_PARTITION_KEY = "0";
const MAX_PARTITION_KEY_LENGTH = 256;

// Refactor Reason: This line of code was repeated at 2 places. 
// Hence creating this utility function to reuse it at both the places.
const generateCandidate = input => {
  const hash = crypto.createHash("sha3-512").update(input).digest("hex");
  return hash ? hash : TRIVIAL_PARTITION_KEY;
};

exports.deterministicPartitionKey = (event) => {  
  // Refactor Reason: It is best to declare variables with their default initial values rather than 
  // being left as undefined. 
  // It saves the lines of code where we have to explicitly set them with default values 
  // based on some conditions.
  // Also, if the inputs are erroneous, we can directly return them as they already have the necessary 
  // default values.
  let candidate = TRIVIAL_PARTITION_KEY;

  // Refactor Reason: I prefer to do all basic null checks at the top of the function, so that all 
  // error conditions and basic error handlings are nicely collated the top. 
  // Also, the code after that can safely assume that the value they are dealing will never be erronous.
  if (!event) return candidate;

  // Refactor Reason: Since we have added the default value for 'candidate' at the top, 
  // there is no need to do null check for 'candidate' variable here again. Hence removing it from here.
  if (event.partitionKey) {
    candidate = event.partitionKey;
  } else {
    // Refactor Reason: There was no need to create the additional 'data' variable here, as it is only 
    // being used on the next like and no where else. We can directly pass the JSON Stringify output 
    // to the generateHash function.
    candidate = generateCandidate(JSON.stringify(event));
  }

  // Refactor Reason: Candidate will not be undefined at this stage. Hence removing the null check.
  if (typeof candidate !== "string") {
    candidate = JSON.stringify(candidate);
  } 

  if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
    candidate = generateCandidate(candidate);
  }
  
  return candidate;
};