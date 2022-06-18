const crypto = require("crypto");
const { deterministicPartitionKey } = require("./dpk");

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });

  it("Returns the 'partition key' back when it is set in event object as a string", () => {
    const trivialKey = deterministicPartitionKey({ partitionKey: 'abc' });
    expect(trivialKey).toBe("abc");
  });

  it("Returns the partition key back in stringified format when it is set in event as non-string", () => {
    const event = { partitionKey: { data: 'abc' } };
    const trivialKey = deterministicPartitionKey(event);
    expect(trivialKey).toEqual(JSON.stringify(event.partitionKey));
  });

  it("Returns the hash of the event object back when partition key is missing", () => {
    const event = { data: 'abc' };
    const trivialKey = deterministicPartitionKey(event);
    const expected = crypto.createHash("sha3-512").update(JSON.stringify(event)).digest("hex")
    expect(trivialKey).toBe(expected);
  });

  it("Returns the hash of the event object back when partition key exceeds max length", () => {
    let partitionKey = "";
    let count = 0;
    while (count <= 30) {
      partitionKey += "1234567890";
      count++;
    }
    const event = { partitionKey };
    const trivialKey = deterministicPartitionKey(event);
    const expected = crypto.createHash("sha3-512").update(partitionKey).digest("hex")
    expect(trivialKey).toBe(expected);
  });
});
