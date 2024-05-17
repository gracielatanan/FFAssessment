// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ClothingStore {
    struct Clothing {
        address owner;
        string name;
        uint256 price;
        bool isAvailable;
    }

    Clothing[] public clothes;

    event ClothingListed(uint256 indexed id, string name, uint256 price);
    event ClothingPurchased(uint256 indexed id, address buyer);

    function listClothing(string memory _name, uint256 _price) public {
        require(_price > 0, "Price must be greater than 0");

        uint256 id = clothes.length;
        clothes.push(Clothing(msg.sender, _name, _price, true));
        emit ClothingListed(id, _name, _price);
    }

    function buyClothing(uint256 _id) public payable {
        require(_id < clothes.length && _id >= 0, "Invalid clothing ID");
        require(clothes[_id].isAvailable, "Clothing item not available");
        require(msg.value >= clothes[_id].price, "Insufficient funds");

        address payable seller = payable(clothes[_id].owner);
        seller.transfer(clothes[_id].price);

        clothes[_id].isAvailable = false;

        emit ClothingPurchased(_id, msg.sender);
    }
}

