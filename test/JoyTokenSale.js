var JoyTokenSale = artifacts.require("JoyTokenSale");
var JoyToken = artifacts.require("JoyToken");

contract('JoyTokenSale', function(accounts){
    let joyToken = null;
    before(async () => {
        joyToken = await JoyToken.deployed();
    });

    let joyTokenSale = null;
    before(async () => {
        joyTokenSale = await JoyTokenSale.deployed();
    });

    var tokenPrice = 1000000000000000; // in wei (smallest subdivision of the Ethereum cryptocurrency) : http://etherconverter.online/
    var admin = accounts[0];
    var buyer = accounts[1];
    var tokensAvailable = 750000;
    var numberOfTokens;


    it('initializes the contract with the correct values', async () => {
        var address = await joyTokenSale.address;
        assert.notEqual(address, 0x0, 'has contract address');
        var token_address = await joyTokenSale.tokenContract();
        assert.notEqual(token_address, 0x0, 'has token contract address');
        const price = await joyTokenSale.tokenPrice();
        assert.equal(price, tokenPrice, 'token price is correct');
    });


    it('facilitates token buying', async () => {
        // Provision 75% of the total tokens to the token sale contract
        await joyToken.transfer(joyTokenSale.address, tokensAvailable, { from: admin });
        numberOfTokens = 10;
        var receipt = await joyTokenSale.buyTokens(numberOfTokens, { from: buyer, value: numberOfTokens * tokenPrice });
        assert.equal(receipt.logs.length, 1, 'triggers one event');
        assert.equal(receipt.logs[0].event, 'Sell', 'should be the "Sell" event');
        assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the account that purchased the tokens');
        assert.equal(receipt.logs[0].args._amount, numberOfTokens, 'logs the number of tokens purchased');
        const amount = await joyTokenSale.tokensSold();
        assert.equal(amount.toNumber(), numberOfTokens, 'increments the number of tokens sold');
        const balance = await joyToken.balanceOf(buyer);
        assert.equal(balance.toNumber(), numberOfTokens);
        const sale_balance = await joyToken.balanceOf(joyTokenSale.address);
        assert.equal(sale_balance.toNumber(), tokensAvailable - numberOfTokens);

        // Try to buy tokens different from the ether value
        try{
            await joyTokenSale.buyTokens(numberOfTokens, { from: buyer, value: 1 });
        } catch(error) {
            assert(error.message.includes('revert'));
            return;
        }
        assert(false, 'msg.value must equal number of tokens in wei');

        // Try to purchase more tokens than available
        try{
            await joyTokenSale.buyTokens(800000, { from: buyer, value: numberOfTokens * tokenPrice });
        } catch(error) {
            assert(error.message.includes('revert'));
            return;
        }
        assert(false, 'cannot purchase more tokens than avialable');
    });

    
    it('ends token sale', async () => {
        // Try to end the sale from an account other than the admin
        try{
            await joyTokenSale.endSale( { from: buyer} );
        } catch(error) {
            assert(error.message.includes('revert'));
            return;
        }
        assert(false, 'must be admin to end the sale');

        // End sale as admin
        await joyTokenSale.endSale( { from: admin } );

        const balance = await joyToken.balanceOf(admin);
        assert.equal(balance.toNumber(), 999990, 'returns all unsold JoyCoins to the admin');

        // Check that TokenSale contract has no balance
        const final_balance = await joyToken.balanceOf(joyTokenSale.address);
        assert.equal(final_balance, 0, 'contract balance reset');
    });
});
