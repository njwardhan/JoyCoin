App = {
    web3provider: null,
    contracts: {},
    account: '0x0',

    init: function() {
        console.log("App initialized...")
        return App.initWeb3();
    },

    initWeb3: function() {
        if (typeof web3 !== 'undefined') {
          // If a web3 instance is already provided by Meta Mask.
          App.web3Provider = window.ethereum;
          web3 = new Web3(window.ethereum);
        } else {
          // Specify default instance if no web3 instance provided
          App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
          web3 = new Web3(App.web3Provider);
        }
        return App.initContracts();
      },
        
    initContracts: function() {
        // Get the contract abstractions from the build directory (json representations)
        $.getJSON("JoyTokenSale.json", function(joyTokenSale) {
        App.contracts.JoyTokenSale = TruffleContract(joyTokenSale);
        App.contracts.JoyTokenSale.setProvider(App.web3Provider);
        App.contracts.JoyTokenSale.deployed().then(function(joyTokenSale) {
            console.log("JoyToken Sale Address:", joyTokenSale.address);
         });
        }).done(function() {
            $.getJSON("JoyToken.json", function(joyToken) {
                App.contracts.JoyToken = TruffleContract(joyToken);
                App.contracts.JoyToken.setProvider(App.web3Provider);
                App.contracts.JoyToken.deployed().then(function(joyToken) {
                console.log("JoyToken Address:", joyToken.address);
            });
            return App.render();
        });
     })
   },

   render: function() {   
    // Load account data
    web3.eth.getCoinbase(function(err, account) {
        if(err === null) {
            console.log("account:", account);
            App.account = account;
            $('#accountAddress').html("Your Account : " + account);
        }
    });
  }
}

$(function() {
    $(window).load(function() {
        App.init();
    })
});  
