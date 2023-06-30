const { expect } = require("chai");
const { ethers } = require("hardhat");

const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const DAI_DECIMALS = 18;

const ercAbi = [
  // Read-Only Functions
  "function balanceOf(address owner) view returns (uint256)",
  // Authenticated Functions
  "function transfer(address to, uint amount) returns (bool)",
  "function deposit() public payable",
  "function approve(address spender, uint256 amount) returns (bool)",
];

describe("UniswapExample", function () {
  it("Should provide a caller with more DAI than they started with after a swap", async function () {

    const simpleSwap = await ethers.deployContract("UniswapExample");
    await simpleSwap.waitForDeployment();
    let signers = await ethers.getSigners();
    console.log(signers);

    const WETH = new ethers.Contract(WETH_ADDRESS, ercAbi, signers[0]);
    const deposit = await WETH.deposit({ value: ethers.parseEther('10') });
    await deposit.wait();

    const DAI = new ethers.Contract(DAI_ADDRESS, ercAbi, signers[0]);
    const expandedDAIBalanceBefore = await DAI.balanceOf(signers[0].getAddress());
    const DAIBalanceBefore = Number(ethers.formatUnits(expandedDAIBalanceBefore, DAI_DECIMALS));

    await WETH.approve(simpleSwap.getAddress(), ethers.parseEther('1'));

    const amountOut = 15;
    const swap = await simpleSwap.convertEthToDai(amountOut,{ value : 100 });
    swap.wait();

    const expandedDAIBalanceAfter = await DAI.balanceOf(signers[0].getAddress());
    const DAIBalanceAfter = Number(ethers.formatUnits(expandedDAIBalanceAfter, DAI_DECIMALS));
    expect(DAIBalanceAfter).is.greaterThan(DAIBalanceBefore);
  });
});