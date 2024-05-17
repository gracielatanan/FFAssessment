// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleContract {
    uint256 public value;

    event ValueChanged(uint256 newValue);

    function setValue(uint256 _newValue) public {
        value = _newValue;
        emit ValueChanged(_newValue);
    }

    function getValue() public view returns (uint256) {
        return value;
    }
}
