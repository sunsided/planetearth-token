const { expect } = require("chai");
const { ethers } = require("hardhat");

// `describe` is a Mocha function that allows you to organize your tests. It's
// not actually needed, but having your tests organized makes debugging them
// easier. All Mocha functions are available in the global scope.

describe("Token contract", function () {
  let tokenContractFactory;
  let token;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    // See also: https://docs.ethers.io/v5/api/signer/
    tokenContractFactory = await ethers.getContractFactory("Token");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // To deploy our contract, we just have to call tokenContractFactory.deploy() and await
    // for it to be deployed(), which happens once its transaction has been
    // mined.
    token = await tokenContractFactory.deploy(1000);
  });

  describe("Deployment", function () {
    it("sets the right owner", async function () {
      expect(await token.owner()).to.equal(owner.address); // Ownable version
      expect(await token.getOwner()).to.equal(owner.address); // BEP20 version
    });

    it("assigns the total supply of tokens to the owner", async function () {
      const ownerBalance = await token.balanceOf(owner.address);
      expect(await token.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("transferOwnership()", function () {
    it("transfers the owner to the new address", async function () {
      expect(token.transferOwnership(addr1.address))
          .to.emit(token, "OwnershipTransferred")
          .withArgs(owner.address, addr1.address);
      expect(await token.owner()).to.equal(addr1.address);
    });

    it("fails when non-owner transfers ownership", async function () {
      expect(token.connect(addr1).transferOwnership(addr2.address))
          .to.be.revertedWith("Ownable: caller is not the owner");
      expect(await token.owner()).to.equal(owner.address);
    });
  });

  describe("transfer()", function () {
    it("transfers tokens between accounts", async function () {
      // Transfer 50 tokens from owner to addr1
      await token.transfer(addr1.address, 50);
      let addr1Balance = await token.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await token.connect(addr1).transfer(addr2.address, 50);

      expect(await token.balanceOf(addr1.address)).to.equal(0);
      expect(await token.balanceOf(addr2.address)).to.equal(50);
    });

    it("fails if sender doesn’t have enough tokens", async function () {
      const initialOwnerBalance = await token.balanceOf(owner.address);

      // Try to send 1 token from addr1 (0 tokens) to owner (1000000 tokens).
      // `require` will evaluate false and revert the transaction.
      await expect(token.connect(addr1).transfer(owner.address, 1))
          .to.be.revertedWith("ERC20: transfer amount exceeds balance");

      // Owner balance shouldn't have changed.
      expect(await token.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    });

    it("updates balances after transfers", async function () {
      const initialOwnerBalance = await token.balanceOf(owner.address);

      await token.transfer(addr1.address, 100);
      await token.transfer(addr2.address, 50);

      expect(await token.balanceOf(owner.address)).to.equal(initialOwnerBalance.sub(150));
      expect(await token.balanceOf(addr1.address)).to.equal(100);
      expect(await token.balanceOf(addr2.address)).to.equal(50);
    });

    it('reverts when transferring tokens to the zero address', async function () {
      // Owner can't send tokens to null address.
      expect(token.transfer(ethers.constants.AddressZero, 50))
          .to.be.revertedWith("ERC20: transfer to the zero address");

      // Regular holder can't send tokens to null address.
      expect(token.connect(addr1).transfer(ethers.constants.AddressZero, 50))
          .to.be.revertedWith("ERC20: transfer to the zero address");
    });
  });
});
