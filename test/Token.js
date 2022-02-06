const { expect } = require("chai");
const { ethers } = require("hardhat");

// `describe` is a Mocha function that allows you to organize your tests. It's
// not actually needed, but having your tests organized makes debugging them
// easier. All Mocha functions are available in the global scope.

describe("Token contract", function () {
  let Token;
  let hardhatToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    // See also: https://docs.ethers.io/v5/api/signer/
    Token = await ethers.getContractFactory("Token");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // To deploy our contract, we just have to call Token.deploy() and await
    // for it to be deployed(), which happens once its transaction has been
    // mined.
    hardhatToken = await Token.deploy(1000);
  });

  describe("Deployment", function () {
    it("sets the right owner", async function () {
      expect(await hardhatToken.owner()).to.equal(owner.address); // Ownable version
      expect(await hardhatToken.getOwner()).to.equal(owner.address); // BEP20 version
    });

    it("assigns the total supply of tokens to the owner", async function () {
      const ownerBalance = await hardhatToken.balanceOf(owner.address);
      expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("transferOwnership()", function () {
    it("transfers the owner to the new address", async function () {
      expect(hardhatToken.transferOwnership(addr1.address))
          .to.emit(hardhatToken, "OwnershipTransferred")
          .withArgs(owner.address, addr1.address);
      expect(await hardhatToken.owner()).to.equal(addr1.address);
    });

    it("fails when non-owner transfers ownership", async function () {
      expect(hardhatToken.connect(addr1).transferOwnership(addr2.address))
          .to.be.revertedWith("Ownable: caller is not the owner");
      expect(await hardhatToken.owner()).to.equal(owner.address);
    });
  });

  describe("transfer()", function () {
    it("transfers tokens between accounts", async function () {
      // Transfer 50 tokens from owner to addr1
      await hardhatToken.transfer(addr1.address, 50);
      let addr1Balance = await hardhatToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await hardhatToken.connect(addr1).transfer(addr2.address, 50);

      expect(await hardhatToken.balanceOf(addr1.address)).to.equal(0);
      expect(await hardhatToken.balanceOf(addr2.address)).to.equal(50);
    });

    it("fails if sender doesn’t have enough tokens", async function () {
      const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

      // Try to send 1 token from addr1 (0 tokens) to owner (1000000 tokens).
      // `require` will evaluate false and revert the transaction.
      await expect(hardhatToken.connect(addr1).transfer(owner.address, 1))
          .to.be.revertedWith("ERC20: transfer amount exceeds balance");

      // Owner balance shouldn't have changed.
      expect(await hardhatToken.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    });

    it("updates balances after transfers", async function () {
      const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

      await hardhatToken.transfer(addr1.address, 100);
      await hardhatToken.transfer(addr2.address, 50);

      expect(await hardhatToken.balanceOf(owner.address)).to.equal(initialOwnerBalance.sub(150));
      expect(await hardhatToken.balanceOf(addr1.address)).to.equal(100);
      expect(await hardhatToken.balanceOf(addr2.address)).to.equal(50);
    });

    it('reverts when transferring tokens to the zero address', async function () {
      // Owner can't send tokens to null address.
      expect(hardhatToken.transfer(ethers.constants.AddressZero, 50))
          .to.be.revertedWith("ERC20: transfer to the zero address");

      // Regular holder can't send tokens to null address.
      expect(hardhatToken.connect(addr1).transfer(ethers.constants.AddressZero, 50))
          .to.be.revertedWith("ERC20: transfer to the zero address");
    });
  });
});
