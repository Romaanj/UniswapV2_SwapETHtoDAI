// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.17;

import '../node_modules/@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol';

contract UniswapExample {
  address internal constant UNISWAP_ROUTER_ADDRESS = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D ;

  IUniswapV2Router02 public uniswapRouter;
  address private multiDaiGoerli = 0x6B175474E89094C44Da98b954EedeAC495271d0F;

  constructor() {
    uniswapRouter = IUniswapV2Router02(UNISWAP_ROUTER_ADDRESS); 
  }

  function convertEthToDai(uint daiAmount) public payable {
    uint deadline = block.timestamp + 15;
    uniswapRouter.swapETHForExactTokens{ value: msg.value }(daiAmount, getPathForETHtoDAI(), msg.sender, deadline);
    
    // refund leftover ETH to user
    (bool success,) = msg.sender.call{ value: address(this).balance }("");
    require(success, "refund failed");
  }
  
  function getEstimatedETHforDAI(uint daiAmount) public view returns (uint[] memory) {
    return uniswapRouter.getAmountsIn(daiAmount, getPathForETHtoDAI());
  }

  function getPathForETHtoDAI() private view returns (address[] memory) {
    address[] memory path = new address[](2);
    path[0] = uniswapRouter.WETH();
    path[1] = multiDaiGoerli;
    
    return path;
  }

  receive() payable external {}
}