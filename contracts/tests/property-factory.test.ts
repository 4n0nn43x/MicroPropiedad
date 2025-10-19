import { describe, expect, it } from "vitest";
import { Cl, ClarityType } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const owner1 = accounts.get("wallet_1")!;
const owner2 = accounts.get("wallet_2")!;
const randomUser = accounts.get("wallet_3")!;

// Mock property contract addresses (using different wallets for test)
const propertyContract1 = accounts.get("wallet_4")!;
const propertyContract2 = accounts.get("wallet_5")!;

describe("PropertyFactory - Registration", () => {

  it("should register a new property successfully", () => {
    const { result } = simnet.callPublicFn(
      "property-factory",
      "register-property",
      [
        Cl.principal(propertyContract1),
        Cl.stringAscii("Buenos Aires Apt 1"),
        Cl.stringAscii("BAA1"),
        Cl.uint(1000),
        Cl.stringUtf8("Av. Corrientes 1234, Buenos Aires, Argentina"),
        Cl.stringUtf8("ipfs://QmPropertyMetadata123"),
      ],
      owner1
    );

    expect(result).toBeOk(Cl.uint(1)); // First property ID
  });

  it("should increment property counter after registration", () => {
    simnet.callPublicFn(
      "property-factory",
      "register-property",
      [
        Cl.principal(propertyContract1),
        Cl.stringAscii("Property 1"),
        Cl.stringAscii("P1"),
        Cl.uint(500),
        Cl.stringUtf8("Location 1"),
        Cl.stringUtf8("ipfs://meta1"),
      ],
      owner1
    );

    simnet.callPublicFn(
      "property-factory",
      "register-property",
      [
        Cl.principal(propertyContract2),
        Cl.stringAscii("Property 2"),
        Cl.stringAscii("P2"),
        Cl.uint(750),
        Cl.stringUtf8("Location 2"),
        Cl.stringUtf8("ipfs://meta2"),
      ],
      owner2
    );

    const { result } = simnet.callReadOnlyFn(
      "property-factory",
      "get-property-count",
      [],
      deployer
    );

    expect(result).toBeOk(Cl.uint(2));
  });

  it("should fail to register duplicate property contract", () => {
    simnet.callPublicFn(
      "property-factory",
      "register-property",
      [
        Cl.principal(propertyContract1),
        Cl.stringAscii("Property 1"),
        Cl.stringAscii("P1"),
        Cl.uint(500),
        Cl.stringUtf8("Location 1"),
        Cl.stringUtf8("ipfs://meta1"),
      ],
      owner1
    );

    // Try to register same contract again
    const { result } = simnet.callPublicFn(
      "property-factory",
      "register-property",
      [
        Cl.principal(propertyContract1),
        Cl.stringAscii("Property 1 Again"),
        Cl.stringAscii("P1A"),
        Cl.uint(500),
        Cl.stringUtf8("Location 1"),
        Cl.stringUtf8("ipfs://meta1"),
      ],
      owner1
    );

    expect(result).toBeErr(Cl.uint(201)); // ERR-PROPERTY-EXISTS
  });

  it("should fail if total shares is zero", () => {
    const { result } = simnet.callPublicFn(
      "property-factory",
      "register-property",
      [
        Cl.principal(propertyContract1),
        Cl.stringAscii("Invalid Property"),
        Cl.stringAscii("INV"),
        Cl.uint(0), // Zero shares
        Cl.stringUtf8("Somewhere"),
        Cl.stringUtf8("ipfs://invalid"),
      ],
      owner1
    );

    expect(result).toBeErr(Cl.uint(203)); // ERR-INVALID-DATA
  });
});

describe("PropertyFactory - Property Queries", () => {

  it("should retrieve property details by ID", () => {
    simnet.callPublicFn(
      "property-factory",
      "register-property",
      [
        Cl.principal(propertyContract1),
        Cl.stringAscii("Test Property"),
        Cl.stringAscii("TP"),
        Cl.uint(1000),
        Cl.stringUtf8("Test Location"),
        Cl.stringUtf8("ipfs://test"),
      ],
      owner1
    );

    const { result } = simnet.callReadOnlyFn(
      "property-factory",
      "get-property",
      [Cl.uint(1)],
      deployer
    );

    expect(result).toHaveClarityType(ClarityType.ResponseOk);
  });

  it("should return property ID by contract address", () => {
    simnet.callPublicFn(
      "property-factory",
      "register-property",
      [
        Cl.principal(propertyContract1),
        Cl.stringAscii("Find Me"),
        Cl.stringAscii("FM"),
        Cl.uint(500),
        Cl.stringUtf8("Here"),
        Cl.stringUtf8("ipfs://findme"),
      ],
      owner1
    );

    const { result } = simnet.callReadOnlyFn(
      "property-factory",
      "get-property-id-by-contract",
      [Cl.principal(propertyContract1)],
      deployer
    );

    expect(result).toBeOk(Cl.some(Cl.uint(1)));
  });

  it("should return property metadata URI", () => {
    simnet.callPublicFn(
      "property-factory",
      "register-property",
      [
        Cl.principal(propertyContract1),
        Cl.stringAscii("Metadata Test"),
        Cl.stringAscii("MT"),
        Cl.uint(1000),
        Cl.stringUtf8("Meta Location"),
        Cl.stringUtf8("ipfs://QmMetadataHash"),
      ],
      owner1
    );

    const { result } = simnet.callReadOnlyFn(
      "property-factory",
      "get-property-metadata",
      [Cl.uint(1)],
      deployer
    );

    expect(result).toBeOk(Cl.some(Cl.stringUtf8("ipfs://QmMetadataHash")));
  });

  it("should return owner properties list", () => {
    simnet.callPublicFn(
      "property-factory",
      "register-property",
      [
        Cl.principal(propertyContract1),
        Cl.stringAscii("Owner Test 1"),
        Cl.stringAscii("OT1"),
        Cl.uint(500),
        Cl.stringUtf8("Location A"),
        Cl.stringUtf8("ipfs://a"),
      ],
      owner1
    );

    simnet.callPublicFn(
      "property-factory",
      "register-property",
      [
        Cl.principal(propertyContract2),
        Cl.stringAscii("Owner Test 2"),
        Cl.stringAscii("OT2"),
        Cl.uint(750),
        Cl.stringUtf8("Location B"),
        Cl.stringUtf8("ipfs://b"),
      ],
      owner1
    );

    const { result } = simnet.callReadOnlyFn(
      "property-factory",
      "get-owner-properties",
      [Cl.principal(owner1)],
      deployer
    );

    expect(result).toBeOk(Cl.some(Cl.list([Cl.uint(1), Cl.uint(2)])));
  });
});

describe("PropertyFactory - Property Status Management", () => {

  it("should allow owner to update property status", () => {
    simnet.callPublicFn(
      "property-factory",
      "register-property",
      [
        Cl.principal(propertyContract1),
        Cl.stringAscii("Status Test"),
        Cl.stringAscii("ST"),
        Cl.uint(1000),
        Cl.stringUtf8("Status Location"),
        Cl.stringUtf8("ipfs://status"),
      ],
      owner1
    );

    const { result } = simnet.callPublicFn(
      "property-factory",
      "update-property-status",
      [Cl.uint(1), Cl.stringAscii("sold-out")],
      owner1
    );

    expect(result).toBeOk(Cl.bool(true));
  });

  it("should fail if non-owner tries to update status", () => {
    simnet.callPublicFn(
      "property-factory",
      "register-property",
      [
        Cl.principal(propertyContract1),
        Cl.stringAscii("Auth Test"),
        Cl.stringAscii("AT"),
        Cl.uint(1000),
        Cl.stringUtf8("Auth Location"),
        Cl.stringUtf8("ipfs://auth"),
      ],
      owner1
    );

    const { result } = simnet.callPublicFn(
      "property-factory",
      "update-property-status",
      [Cl.uint(1), Cl.stringAscii("paused")],
      randomUser // Not the owner
    );

    expect(result).toBeErr(Cl.uint(200)); // ERR-NOT-AUTHORIZED
  });

  it("should fail to update non-existent property", () => {
    const { result } = simnet.callPublicFn(
      "property-factory",
      "update-property-status",
      [Cl.uint(999), Cl.stringAscii("active")],
      owner1
    );

    expect(result).toBeErr(Cl.uint(202)); // ERR-PROPERTY-NOT-FOUND
  });
});

describe("PropertyFactory - Property Statistics", () => {

  it("should allow owner to update property stats", () => {
    simnet.callPublicFn(
      "property-factory",
      "register-property",
      [
        Cl.principal(propertyContract1),
        Cl.stringAscii("Stats Test"),
        Cl.stringAscii("STS"),
        Cl.uint(1000),
        Cl.stringUtf8("Stats Location"),
        Cl.stringUtf8("ipfs://stats"),
      ],
      owner1
    );

    const { result } = simnet.callPublicFn(
      "property-factory",
      "update-property-stats",
      [
        Cl.uint(1),
        Cl.uint(100_000_000), // total-raised
        Cl.uint(50), // total-investors
        Cl.uint(1000000), // last-payout
      ],
      owner1
    );

    expect(result).toBeOk(Cl.bool(true));
  });

  it("should fail if non-owner tries to update stats", () => {
    simnet.callPublicFn(
      "property-factory",
      "register-property",
      [
        Cl.principal(propertyContract1),
        Cl.stringAscii("Stats Auth Test"),
        Cl.stringAscii("SAT"),
        Cl.uint(1000),
        Cl.stringUtf8("Stats Auth Location"),
        Cl.stringUtf8("ipfs://statsauth"),
      ],
      owner1
    );

    const { result } = simnet.callPublicFn(
      "property-factory",
      "update-property-stats",
      [Cl.uint(1), Cl.uint(50000000), Cl.uint(25), Cl.uint(500000)],
      randomUser
    );

    expect(result).toBeErr(Cl.uint(200)); // ERR-NOT-AUTHORIZED
  });

  it("should retrieve property statistics", () => {
    simnet.callPublicFn(
      "property-factory",
      "register-property",
      [
        Cl.principal(propertyContract1),
        Cl.stringAscii("Get Stats Test"),
        Cl.stringAscii("GST"),
        Cl.uint(1000),
        Cl.stringUtf8("Get Stats Location"),
        Cl.stringUtf8("ipfs://getstats"),
      ],
      owner1
    );

    simnet.callPublicFn(
      "property-factory",
      "update-property-stats",
      [Cl.uint(1), Cl.uint(75000000), Cl.uint(40), Cl.uint(750000)],
      owner1
    );

    const { result } = simnet.callReadOnlyFn(
      "property-factory",
      "get-property-stats",
      [Cl.uint(1)],
      deployer
    );

    expect(result).toBeOk(
      Cl.some(
        Cl.tuple({
          "total-raised": Cl.uint(75000000),
          "total-investors": Cl.uint(40),
          "last-payout": Cl.uint(750000),
        })
      )
    );
  });
});

describe("PropertyFactory - Admin Functions", () => {

  it("should allow admin to pause factory", () => {
    const { result } = simnet.callPublicFn(
      "property-factory",
      "set-paused",
      [Cl.bool(true)],
      deployer
    );

    expect(result).toBeOk(Cl.bool(true));
  });

  it("should fail registration when factory is paused", () => {
    simnet.callPublicFn("property-factory", "set-paused", [Cl.bool(true)], deployer);

    const { result } = simnet.callPublicFn(
      "property-factory",
      "register-property",
      [
        Cl.principal(propertyContract1),
        Cl.stringAscii("Paused Test"),
        Cl.stringAscii("PT"),
        Cl.uint(1000),
        Cl.stringUtf8("Paused Location"),
        Cl.stringUtf8("ipfs://paused"),
      ],
      owner1
    );

    expect(result).toBeErr(Cl.uint(204)); // ERR-PAUSED
  });

  it("should fail if non-admin tries to pause", () => {
    const { result } = simnet.callPublicFn(
      "property-factory",
      "set-paused",
      [Cl.bool(true)],
      randomUser
    );

    expect(result).toBeErr(Cl.uint(200)); // ERR-NOT-AUTHORIZED
  });

  it("should allow admin to update treasury", () => {
    const { result } = simnet.callPublicFn(
      "property-factory",
      "set-treasury",
      [Cl.principal(owner2)],
      deployer
    );

    expect(result).toBeOk(Cl.bool(true));

    // Verify treasury was updated
    const treasuryResult = simnet.callReadOnlyFn(
      "property-factory",
      "get-treasury",
      [],
      deployer
    );
    expect(treasuryResult.result).toBeOk(Cl.principal(owner2));
  });

  it("should fail if non-admin tries to update treasury", () => {
    const { result} = simnet.callPublicFn(
      "property-factory",
      "set-treasury",
      [Cl.principal(owner2)],
      randomUser
    );

    expect(result).toBeErr(Cl.uint(200)); // ERR-NOT-AUTHORIZED
  });
});

describe("PropertyFactory - Read-Only Functions", () => {

  it("should return correct platform fee", () => {
    const { result } = simnet.callReadOnlyFn(
      "property-factory",
      "get-platform-fee",
      [],
      deployer
    );

    expect(result).toBeOk(Cl.uint(250)); // 2.5% = 250 basis points
  });

  it("should return paused status", () => {
    simnet.callPublicFn("property-factory", "set-paused", [Cl.bool(true)], deployer);

    const { result } = simnet.callReadOnlyFn(
      "property-factory",
      "is-paused",
      [],
      deployer
    );

    expect(result).toBeOk(Cl.bool(true));
  });

  it("should return correct admin address", () => {
    const { result } = simnet.callReadOnlyFn(
      "property-factory",
      "get-admin",
      [],
      deployer
    );

    expect(result).toBeOk(Cl.principal(deployer));
  });

  it("should return zero count for new factory", () => {
    const { result } = simnet.callReadOnlyFn(
      "property-factory",
      "get-property-count",
      [],
      deployer
    );

    expect(result).toBeOk(Cl.uint(0));
  });
});
