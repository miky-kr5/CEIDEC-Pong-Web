/*
 * -----------------------------------------------------------------------------------
 * "THE BEER-WARE LICENSE" (Revision 42):
 * <miguel.astor@ciens.ucv.ve> wrote this file. As long as you retain this notice you
 * can do whatever you want with this stuff. If we meet some day, and you think
 * this stuff is worth it, you can buy me a beer in return. Miguel Angel Astor
 * -----------------------------------------------------------------------------------
 */

pragma solidity ^0.4.24;

import "./Ownable.sol";

contract Pong is Ownable {
  uint256 timesPlayed;

  event CanPlayTheGame(address indexed player);
  
  constructor() public {
    timesPlayed = 0;
  }
  
  function kill() public onlyOwner {
    selfdestruct(owner);
  }

  function howManytimesPlayed() public view returns (uint256) {
    return timesPlayed;
  }
  
  function play() payable public {
    require(msg.value == 1000000000000000000);
    owner.transfer(msg.value);
    timesPlayed += 1;
    emit CanPlayTheGame(msg.sender);
  }
}
