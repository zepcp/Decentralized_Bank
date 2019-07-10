import os
import json
import web3

from web3 import Web3, HTTPProvider
from solc import compile_source
from web3.contract import ConciseContract

WEI_ETHER = 10**18

# web3.py Instance
w3 = Web3(HTTPProvider('http://%s:%d' % ('localhost', 8545), request_kwargs={'timeout': 60}))

BASENAME = os.path.realpath(__file__)
BASE_DIR = os.path.dirname(BASENAME)+'/contracts'

# Solidity Source Code
CONTRACT_SOURCE_CODE = open(os.path.join(BASE_DIR, 'decentralizedBank.sol')).read().strip()

# Compiled source code
compiled_sol = compile_source(CONTRACT_SOURCE_CODE)
contract_interface = compiled_sol['<stdin>:decentralizedBank']

#Unlock Account
src = '0x3db82142DC5857b30741FfFA87dF09dCe9D21B7F'
password = 'test'
unlocked = w3.personal.unlockAccount(src, password) 

# set pre-funded account as sender
w3.eth.defaultAccount = src

# Instantiate and deploy contract
decentralizedBank = w3.eth.contract(abi=contract_interface['abi'], bytecode=contract_interface['bin'])

# Submit the transaction that deploys the contract
#tx_hash = decentralizedBank.constructor().transact()
#print(w3.toHex(tx_hash)) # 0x8fbf361e26b3adae563153d5c1816fb440b1da044547a3df28ffa2039555273b

# Wait for the transaction to be mined, and get the transaction receipt
#tx_receipt = w3.eth.waitForTransactionReceipt(tx_hash)
#print(tx_receipt)

contractAddress = '0xb41D60C2A57C4f0a38813DaDa76F4C8533014300'

# Create the contract instance with the newly-deployed address
decentralizedBank = w3.eth.contract(
    address=contractAddress,
    abi=contract_interface['abi'],
)

# Display the default greeting from the contract
print('Check Account Info (Balance, RemainingDays, Heir): {}'.format(
    decentralizedBank.functions.checkAccount().call()
))

#print('Make 1st Deposit')
#deposit = int(0.005*WEI_ETHER)
#tx_hash = decentralizedBank.functions.deposit(10, '0x31a16aDF2D5FC73F149fBB779D20c036678b1bBD').transact(transaction={'value':deposit})
#print(w3.toHex(tx_hash)) # 0x78098464e549e19fabec22841254bfb5c596886aa54e905fb34e145cd00379ab

#print('Make 1st Transfer')
#transfer = int(0.005*WEI_ETHER)
#tx_hash = decentralizedBank.functions.transfer(transfer, src).transact()
#print(w3.toHex(tx_hash)) # 0x78098464e549e19fabec22841254bfb5c596886aa54e905fb34e145cd00379ab
