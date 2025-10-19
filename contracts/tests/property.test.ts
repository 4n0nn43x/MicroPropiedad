import { describe, expect, it, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const investor1 = accounts.get("wallet_1")!;
const investor2 = accounts.get("wallet_2")!;
const investor3 = accounts.get("wallet_3")!;
const oracle = accounts.get("wallet_4")!;

// Test constants
const PROPERTY_NAME = "Buenos Aires Apt 1";
const PROPERTY_SYMBOL = "BAA1";
const PROPERTY_URI = "ipfs://QmPropertyMetadata123";
const PROPERTY_ADDRESS = "Av. Corrientes 1234, Buenos Aires, Argentina";
const TOTAL_SHARES = 1000;
const SHARE_PRICE = 100_000; // 100,000 micro-STX = 0.1 STX
const MIN_PURCHASE = 1;

describe("Property Contract - Initialization", () => {

  it("should initialize property correctly", () => {
    const { result } = simnet.callPublicFn(
      "property",
      "initialize",
      [
        Cl.stringAscii(PROPERTY_NAME),
        Cl.stringAscii(PROPERTY_SYMBOL),
        Cl.some(Cl.stringUtf8(PROPERTY_URI)),
        Cl.uint(TOTAL_SHARES),
        Cl.uint(SHARE_PRICE),
        Cl.uint(MIN_PURCHASE),
        Cl.stringUtf8(PROPERTY_ADDRESS),
      ],
      deployer
    );

    expect(result).toBeOk(Cl.bool(true));
  });

  it("should fail to initialize twice", () => {
    // First initialization
    simnet.callPublicFn(
      "property",
      "initialize",
      [
        Cl.stringAscii(PROPERTY_NAME),
        Cl.stringAscii(PROPERTY_SYMBOL),
        Cl.some(Cl.stringUtf8(PROPERTY_URI)),
        Cl.uint(TOTAL_SHARES),
        Cl.uint(SHARE_PRICE),
        Cl.uint(MIN_PURCHASE),
        Cl.stringUtf8(PROPERTY_ADDRESS),
      ],
      deployer
    );

    // Second initialization should fail
    const { result } = simnet.callPublicFn(
      "property",
      "initialize",
      [
        Cl.stringAscii("Another Name"),
        Cl.stringAscii("AN"),
        Cl.some(Cl.stringUtf8("ipfs://other")),
        Cl.uint(500),
        Cl.uint(50000),
        Cl.uint(1),
        Cl.stringUtf8("Other Address"),
      ],
      deployer
    );

    expect(result).toBeErr(Cl.uint(100)); // ERR-NOT-AUTHORIZED
  });

  it("should fail if non-owner tries to initialize", () => {
    const { result } = simnet.callPublicFn(
      "property",
      "initialize",
      [
        Cl.stringAscii(PROPERTY_NAME),
        Cl.stringAscii(PROPERTY_SYMBOL),
        Cl.some(Cl.stringUtf8(PROPERTY_URI)),
        Cl.uint(TOTAL_SHARES),
        Cl.uint(SHARE_PRICE),
        Cl.uint(MIN_PURCHASE),
        Cl.stringUtf8(PROPERTY_ADDRESS),
      ],
      investor1 // Not the deployer
    );

    expect(result).toBeErr(Cl.uint(100)); // ERR-NOT-AUTHORIZED
  });

  it("should return correct property info after initialization", () => {
    simnet.callPublicFn(
      "property",
      "initialize",
      [
        Cl.stringAscii(PROPERTY_NAME),
        Cl.stringAscii(PROPERTY_SYMBOL),
        Cl.some(Cl.stringUtf8(PROPERTY_URI)),
        Cl.uint(TOTAL_SHARES),
        Cl.uint(SHARE_PRICE),
        Cl.uint(MIN_PURCHASE),
        Cl.stringUtf8(PROPERTY_ADDRESS),
      ],
      deployer
    );

    const { result } = simnet.callReadOnlyFn(
      "property",
      "get-property-info",
      [],
      deployer
    );

    expect(result).toBeOk(
      Cl.tuple({
        name: Cl.stringAscii(PROPERTY_NAME),
        symbol: Cl.stringAscii(PROPERTY_SYMBOL),
        uri: Cl.some(Cl.stringUtf8(PROPERTY_URI)),
        address: Cl.stringUtf8(PROPERTY_ADDRESS),
        "total-shares": Cl.uint(TOTAL_SHARES),
        "shares-sold": Cl.uint(0),
        "share-price": Cl.uint(SHARE_PRICE),
        "min-purchase": Cl.uint(MIN_PURCHASE),
        "sale-active": Cl.bool(false),
        paused: Cl.bool(false),
      })
    );
  });
});

describe("Property Contract - Share Purchase", () => {

  beforeEach(() => {
    // Initialize property before each test
    simnet.callPublicFn(
      "property",
      "initialize",
      [
        Cl.stringAscii(PROPERTY_NAME),
        Cl.stringAscii(PROPERTY_SYMBOL),
        Cl.some(Cl.stringUtf8(PROPERTY_URI)),
        Cl.uint(TOTAL_SHARES),
        Cl.uint(SHARE_PRICE),
        Cl.uint(MIN_PURCHASE),
        Cl.stringUtf8(PROPERTY_ADDRESS),
      ],
      deployer
    );

    // Activate sale
    simnet.callPublicFn("property", "set-sale-active", [Cl.bool(true)], deployer);
  });

  it("should allow investor to purchase shares", () => {
    const numShares = 10;
    const { result } = simnet.callPublicFn(
      "property",
      "purchase-shares",
      [Cl.uint(numShares)],
      investor1
    );

    expect(result).toBeOk(Cl.uint(numShares));
  });

  it("should update shares-sold after purchase", () => {
    const numShares = 50;
    simnet.callPublicFn("property", "purchase-shares", [Cl.uint(numShares)], investor1);

    const { result } = simnet.callReadOnlyFn("property", "get-property-info", [], deployer);
    const info = result.expectOk().expectTuple();

    expect(info["shares-sold"]).toBeUint(numShares);
  });

  it("should update investor balance after purchase", () => {
    const numShares = 25;
    simnet.callPublicFn("property", "purchase-shares", [Cl.uint(numShares)], investor1);

    const { result } = simnet.callReadOnlyFn(
      "property",
      "get-balance",
      [Cl.principal(investor1)],
      deployer
    );

    expect(result).toBeOk(Cl.uint(numShares));
  });

  it("should fail if sale is not active", () => {
    // Deactivate sale
    simnet.callPublicFn("property", "set-sale-active", [Cl.bool(false)], deployer);

    const { result } = simnet.callPublicFn(
      "property",
      "purchase-shares",
      [Cl.uint(10)],
      investor1
    );

    expect(result).toBeErr(Cl.uint(102)); // ERR-SALE-NOT-ACTIVE
  });

  it("should fail if purchasing less than minimum", () => {
    const { result } = simnet.callPublicFn(
      "property",
      "purchase-shares",
      [Cl.uint(0)],
      investor1
    );

    expect(result).toBeErr(Cl.uint(104)); // ERR-INVALID-AMOUNT
  });

  it("should fail if purchasing more than available", () => {
    const { result } = simnet.callPublicFn(
      "property",
      "purchase-shares",
      [Cl.uint(TOTAL_SHARES + 100)],
      investor1
    );

    expect(result).toBeErr(Cl.uint(103)); // ERR-INSUFFICIENT-SHARES
  });

  it("should allow multiple investors to purchase", () => {
    simnet.callPublicFn("property", "purchase-shares", [Cl.uint(100)], investor1);
    simnet.callPublicFn("property", "purchase-shares", [Cl.uint(200)], investor2);
    simnet.callPublicFn("property", "purchase-shares", [Cl.uint(150)], investor3);

    const balance1 = simnet.callReadOnlyFn("property", "get-balance", [Cl.principal(investor1)], deployer);
    const balance2 = simnet.callReadOnlyFn("property", "get-balance", [Cl.principal(investor2)], deployer);
    const balance3 = simnet.callReadOnlyFn("property", "get-balance", [Cl.principal(investor3)], deployer);

    expect(balance1.result).toBeOk(Cl.uint(100));
    expect(balance2.result).toBeOk(Cl.uint(200));
    expect(balance3.result).toBeOk(Cl.uint(150));
  });

  it("should fail if contract is paused", () => {
    simnet.callPublicFn("property", "set-paused", [Cl.bool(true)], deployer);

    const { result } = simnet.callPublicFn(
      "property",
      "purchase-shares",
      [Cl.uint(10)],
      investor1
    );

    expect(result).toBeErr(Cl.uint(110)); // ERR-PAUSED
  });
});

describe("Property Contract - Revenue Distribution", () => {

  beforeEach(() => {
    // Initialize and activate sale
    simnet.callPublicFn(
      "property",
      "initialize",
      [
        Cl.stringAscii(PROPERTY_NAME),
        Cl.stringAscii(PROPERTY_SYMBOL),
        Cl.some(Cl.stringUtf8(PROPERTY_URI)),
        Cl.uint(TOTAL_SHARES),
        Cl.uint(SHARE_PRICE),
        Cl.uint(MIN_PURCHASE),
        Cl.stringUtf8(PROPERTY_ADDRESS),
      ],
      deployer
    );
    simnet.callPublicFn("property", "set-sale-active", [Cl.bool(true)], deployer);

    // Multiple investors purchase shares
    simnet.callPublicFn("property", "purchase-shares", [Cl.uint(400)], investor1);
    simnet.callPublicFn("property", "purchase-shares", [Cl.uint(300)], investor2);
    simnet.callPublicFn("property", "purchase-shares", [Cl.uint(300)], investor3);

    // Set oracle
    simnet.callPublicFn("property", "set-authorized-oracle", [Cl.principal(oracle)], deployer);
  });

  it("should allow oracle to distribute payout", () => {
    const payoutAmount = 1_000_000; // 1 STX = 1,000,000 micro-STX

    const { result } = simnet.callPublicFn(
      "property",
      "distribute-payout",
      [Cl.uint(payoutAmount)],
      oracle
    );

    expect(result).toBeOk(Cl.uint(1)); // First round ID
  });

  it("should fail if non-oracle tries to distribute", () => {
    const { result } = simnet.callPublicFn(
      "property",
      "distribute-payout",
      [Cl.uint(1_000_000)],
      investor1 // Not the oracle
    );

    expect(result).toBeErr(Cl.uint(108)); // ERR-INVALID-ORACLE
  });

  it("should increment payout round after distribution", () => {
    simnet.callPublicFn("property", "distribute-payout", [Cl.uint(1_000_000)], oracle);
    simnet.callPublicFn("property", "distribute-payout", [Cl.uint(2_000_000)], oracle);

    const { result } = simnet.callReadOnlyFn("property", "get-current-round", [], deployer);

    expect(result).toBeOk(Cl.uint(2));
  });

  it("should fail to distribute zero amount", () => {
    const { result } = simnet.callPublicFn(
      "property",
      "distribute-payout",
      [Cl.uint(0)],
      oracle
    );

    expect(result).toBeErr(Cl.uint(104)); // ERR-INVALID-AMOUNT
  });

  it("should store payout round data correctly", () => {
    const payoutAmount = 1_000_000;
    simnet.callPublicFn("property", "distribute-payout", [Cl.uint(payoutAmount)], oracle);

    const { result } = simnet.callReadOnlyFn(
      "property",
      "get-payout-round",
      [Cl.uint(1)],
      deployer
    );

    const roundData = result.expectOk().expectSome().expectTuple();
    expect(roundData["total-amount"]).toBeUint(payoutAmount);
    expect(roundData["total-shares-snapshot"]).toBeUint(1000); // All shares sold
  });
});

describe("Property Contract - Claim Payout", () => {

  beforeEach(() => {
    // Setup: Initialize, sell shares, distribute payout
    simnet.callPublicFn(
      "property",
      "initialize",
      [
        Cl.stringAscii(PROPERTY_NAME),
        Cl.stringAscii(PROPERTY_SYMBOL),
        Cl.some(Cl.stringUtf8(PROPERTY_URI)),
        Cl.uint(TOTAL_SHARES),
        Cl.uint(SHARE_PRICE),
        Cl.uint(MIN_PURCHASE),
        Cl.stringUtf8(PROPERTY_ADDRESS),
      ],
      deployer
    );
    simnet.callPublicFn("property", "set-sale-active", [Cl.bool(true)], deployer);

    // Investors buy shares: 40%, 30%, 30%
    simnet.callPublicFn("property", "purchase-shares", [Cl.uint(400)], investor1);
    simnet.callPublicFn("property", "purchase-shares", [Cl.uint(300)], investor2);
    simnet.callPublicFn("property", "purchase-shares", [Cl.uint(300)], investor3);

    // Set oracle and distribute payout
    simnet.callPublicFn("property", "set-authorized-oracle", [Cl.principal(oracle)], deployer);
    simnet.callPublicFn("property", "distribute-payout", [Cl.uint(1_000_000)], oracle);
  });

  it("should allow investor to claim payout", () => {
    const { result } = simnet.callPublicFn(
      "property",
      "claim-payout",
      [Cl.uint(1)],
      investor1
    );

    expect(result).toBeOk(Cl.uint(400_000)); // 40% of 1,000,000
  });

  it("should calculate correct payout amounts", () => {
    const claim1 = simnet.callPublicFn("property", "claim-payout", [Cl.uint(1)], investor1);
    const claim2 = simnet.callPublicFn("property", "claim-payout", [Cl.uint(1)], investor2);
    const claim3 = simnet.callPublicFn("property", "claim-payout", [Cl.uint(1)], investor3);

    expect(claim1.result).toBeOk(Cl.uint(400_000)); // 40%
    expect(claim2.result).toBeOk(Cl.uint(300_000)); // 30%
    expect(claim3.result).toBeOk(Cl.uint(300_000)); // 30%
  });

  it("should fail if trying to claim twice", () => {
    simnet.callPublicFn("property", "claim-payout", [Cl.uint(1)], investor1);

    const { result } = simnet.callPublicFn(
      "property",
      "claim-payout",
      [Cl.uint(1)],
      investor1
    );

    expect(result).toBeErr(Cl.uint(105)); // ERR-ALREADY-CLAIMED
  });

  it("should fail if claiming non-existent round", () => {
    const { result } = simnet.callPublicFn(
      "property",
      "claim-payout",
      [Cl.uint(99)],
      investor1
    );

    expect(result).toBeErr(Cl.uint(106)); // ERR-NO-PAYOUT-AVAILABLE
  });

  it("should calculate claimable amount correctly", () => {
    const { result } = simnet.callReadOnlyFn(
      "property",
      "calculate-claimable",
      [Cl.uint(1), Cl.principal(investor1)],
      deployer
    );

    const claimable = result.expectOk().expectTuple();
    expect(claimable.claimable).toBeUint(400_000);
    expect(claimable.shares).toBeUint(400);
    expect(claimable["already-claimed"]).toBeBool(false);
  });

  it("should update claimed status after claim", () => {
    simnet.callPublicFn("property", "claim-payout", [Cl.uint(1)], investor1);

    const { result } = simnet.callReadOnlyFn(
      "property",
      "has-claimed",
      [Cl.uint(1), Cl.principal(investor1)],
      deployer
    );

    expect(result).toBeOk(Cl.bool(true));
  });

  it("should handle multiple payout rounds", () => {
    // Round 1
    simnet.callPublicFn("property", "claim-payout", [Cl.uint(1)], investor1);

    // Distribute round 2
    simnet.callPublicFn("property", "distribute-payout", [Cl.uint(2_000_000)], oracle);

    // Claim round 2
    const { result } = simnet.callPublicFn(
      "property",
      "claim-payout",
      [Cl.uint(2)],
      investor1
    );

    expect(result).toBeOk(Cl.uint(800_000)); // 40% of 2,000,000
  });

  it("should fail if contract is paused", () => {
    simnet.callPublicFn("property", "set-paused", [Cl.bool(true)], deployer);

    const { result } = simnet.callPublicFn(
      "property",
      "claim-payout",
      [Cl.uint(1)],
      investor1
    );

    expect(result).toBeErr(Cl.uint(110)); // ERR-PAUSED
  });
});

describe("Property Contract - Token Transfer", () => {

  beforeEach(() => {
    simnet.callPublicFn(
      "property",
      "initialize",
      [
        Cl.stringAscii(PROPERTY_NAME),
        Cl.stringAscii(PROPERTY_SYMBOL),
        Cl.some(Cl.stringUtf8(PROPERTY_URI)),
        Cl.uint(TOTAL_SHARES),
        Cl.uint(SHARE_PRICE),
        Cl.uint(MIN_PURCHASE),
        Cl.stringUtf8(PROPERTY_ADDRESS),
      ],
      deployer
    );
    simnet.callPublicFn("property", "set-sale-active", [Cl.bool(true)], deployer);
    simnet.callPublicFn("property", "purchase-shares", [Cl.uint(100)], investor1);
  });

  it("should allow token transfer between investors", () => {
    const { result } = simnet.callPublicFn(
      "property",
      "transfer",
      [
        Cl.uint(50),
        Cl.principal(investor1),
        Cl.principal(investor2),
        Cl.none(),
      ],
      investor1
    );

    expect(result).toBeOk(Cl.bool(true));
  });

  it("should update balances after transfer", () => {
    simnet.callPublicFn(
      "property",
      "transfer",
      [Cl.uint(30), Cl.principal(investor1), Cl.principal(investor2), Cl.none()],
      investor1
    );

    const balance1 = simnet.callReadOnlyFn("property", "get-balance", [Cl.principal(investor1)], deployer);
    const balance2 = simnet.callReadOnlyFn("property", "get-balance", [Cl.principal(investor2)], deployer);

    expect(balance1.result).toBeOk(Cl.uint(70));
    expect(balance2.result).toBeOk(Cl.uint(30));
  });

  it("should fail if trying to transfer more than balance", () => {
    const { result } = simnet.callPublicFn(
      "property",
      "transfer",
      [Cl.uint(200), Cl.principal(investor1), Cl.principal(investor2), Cl.none()],
      investor1
    );

    expect(result).toBeErr(Cl.uint(1)); // Clarity built-in insufficient balance error
  });

  it("should fail if non-sender tries to transfer", () => {
    const { result } = simnet.callPublicFn(
      "property",
      "transfer",
      [Cl.uint(10), Cl.principal(investor1), Cl.principal(investor3), Cl.none()],
      investor2 // Not the owner
    );

    expect(result).toBeErr(Cl.uint(100)); // ERR-NOT-AUTHORIZED
  });

  it("should fail transfer if contract is paused", () => {
    simnet.callPublicFn("property", "set-paused", [Cl.bool(true)], deployer);

    const { result } = simnet.callPublicFn(
      "property",
      "transfer",
      [Cl.uint(10), Cl.principal(investor1), Cl.principal(investor2), Cl.none()],
      investor1
    );

    expect(result).toBeErr(Cl.uint(110)); // ERR-PAUSED
  });
});

describe("Property Contract - Admin Functions", () => {

  beforeEach(() => {
    simnet.callPublicFn(
      "property",
      "initialize",
      [
        Cl.stringAscii(PROPERTY_NAME),
        Cl.stringAscii(PROPERTY_SYMBOL),
        Cl.some(Cl.stringUtf8(PROPERTY_URI)),
        Cl.uint(TOTAL_SHARES),
        Cl.uint(SHARE_PRICE),
        Cl.uint(MIN_PURCHASE),
        Cl.stringUtf8(PROPERTY_ADDRESS),
      ],
      deployer
    );
  });

  it("should allow owner to toggle sale status", () => {
    const { result } = simnet.callPublicFn(
      "property",
      "set-sale-active",
      [Cl.bool(true)],
      deployer
    );

    expect(result).toBeOk(Cl.bool(true));
  });

  it("should fail if non-owner tries to toggle sale", () => {
    const { result } = simnet.callPublicFn(
      "property",
      "set-sale-active",
      [Cl.bool(true)],
      investor1
    );

    expect(result).toBeErr(Cl.uint(100)); // ERR-NOT-AUTHORIZED
  });

  it("should allow owner to pause contract", () => {
    const { result } = simnet.callPublicFn(
      "property",
      "set-paused",
      [Cl.bool(true)],
      deployer
    );

    expect(result).toBeOk(Cl.bool(true));
  });

  it("should allow owner to update oracle", () => {
    const { result } = simnet.callPublicFn(
      "property",
      "set-authorized-oracle",
      [Cl.principal(oracle)],
      deployer
    );

    expect(result).toBeOk(Cl.bool(true));

    // Verify oracle was updated
    const oracleResult = simnet.callReadOnlyFn("property", "get-oracle", [], deployer);
    expect(oracleResult.result).toBeOk(Cl.principal(oracle));
  });

  it("should fail if non-owner tries to update oracle", () => {
    const { result } = simnet.callPublicFn(
      "property",
      "set-authorized-oracle",
      [Cl.principal(oracle)],
      investor1
    );

    expect(result).toBeErr(Cl.uint(100)); // ERR-NOT-AUTHORIZED
  });
});

describe("Property Contract - SIP-010 Compliance", () => {

  beforeEach(() => {
    simnet.callPublicFn(
      "property",
      "initialize",
      [
        Cl.stringAscii(PROPERTY_NAME),
        Cl.stringAscii(PROPERTY_SYMBOL),
        Cl.some(Cl.stringUtf8(PROPERTY_URI)),
        Cl.uint(TOTAL_SHARES),
        Cl.uint(SHARE_PRICE),
        Cl.uint(MIN_PURCHASE),
        Cl.stringUtf8(PROPERTY_ADDRESS),
      ],
      deployer
    );
  });

  it("should return correct token name", () => {
    const { result } = simnet.callReadOnlyFn("property", "get-name", [], deployer);
    expect(result).toBeOk(Cl.stringAscii(PROPERTY_NAME));
  });

  it("should return correct token symbol", () => {
    const { result } = simnet.callReadOnlyFn("property", "get-symbol", [], deployer);
    expect(result).toBeOk(Cl.stringAscii(PROPERTY_SYMBOL));
  });

  it("should return correct decimals", () => {
    const { result } = simnet.callReadOnlyFn("property", "get-decimals", [], deployer);
    expect(result).toBeOk(Cl.uint(6)); // DECIMALS constant
  });

  it("should return correct token URI", () => {
    const { result } = simnet.callReadOnlyFn("property", "get-token-uri", [], deployer);
    expect(result).toBeOk(Cl.some(Cl.stringUtf8(PROPERTY_URI)));
  });

  it("should return zero total supply before any minting", () => {
    const { result } = simnet.callReadOnlyFn("property", "get-total-supply", [], deployer);
    expect(result).toBeOk(Cl.uint(0));
  });

  it("should return correct total supply after purchases", () => {
    simnet.callPublicFn("property", "set-sale-active", [Cl.bool(true)], deployer);
    simnet.callPublicFn("property", "purchase-shares", [Cl.uint(100)], investor1);
    simnet.callPublicFn("property", "purchase-shares", [Cl.uint(200)], investor2);

    const { result } = simnet.callReadOnlyFn("property", "get-total-supply", [], deployer);
    expect(result).toBeOk(Cl.uint(300));
  });
});
