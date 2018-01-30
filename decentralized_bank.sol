pragma solidity ^0.4.19;

//The aim of decentralized_bank contract is to provide your wallet the ultimate backup, the seleccio
basic feature...
	
	//Event writes on log file to enable alert to listeners
	event willExecuted(address account);
	event accountCreated(address account, uint nbDays, address heir);

	uint totalSupply;
	
	struct account {
      address heir;
      uint lastAction;
      uint nbDays;
    }
	
	//Mapping is a dictionary, relating (A => B)
	mapping (address => account) addressToAccount;
	mapping (address => uint) balanceOf;
	
	function deposit (uint _days, address _heir) public payable {
		addressToAccount[msg.sender].lastAction = now;
		balanceOf[msg.sender] = balanceOf[msg.sender] + msg.value;
		if (_days > 0) {
			addressToAccount[msg.sender].nbDays = _days * 1 days;
			addressToAccount[msg.sender].heir = _heir;
		}
		//Call Event to inform Listeners of the creation/update of the savings account
		accountCreated(msg.sender, _days, _heir);
	}
	
	//Only owner of the contract can withdraw funds to any address he desires;
	function transfer (uint _amount, address _withdraw) public {
		addressToAccount[msg.sender].lastAction = now;
		require(balanceOf[msg.sender] >= _amount);
		balanceOf[msg.sender] = balanceOf[msg.sender] - _amount;
		_withdraw.transfer(_amount);
	}
	
	function check_account () external view returns(uint, uint, address) {
		uint RemainingDays = now - addressToAccount[msg.sender].lastAction;
		if (RemainingDays < addressToAccount[msg.sender].nbDays) {
			RemainingDays = (addressToAccount[msg.sender].nbDays - RemainingDays) / (1 days);
		} else {
			RemainingDays = 0;
		}
		return (balanceOf[msg.sender], RemainingDays, addressToAccount[msg.sender].heir);
	}

	//Any person can reclaim the execution of the will if time has passed
	function execute_will (address _account) public {
		require(now >= addressToAccount[_account].lastAction + addressToAccount[_account].nbDays);
		uint _amount = balanceOf[_account];
		balanceOf[_account] = 0;
		addressToAccount[_account].heir.transfer(_amount);
		//Call Event to inform Listeners of the Will Execution
		willExecuted(_account);
	}

}
