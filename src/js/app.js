App = {
    web3provider: null,
    contracts: {},
    account: '0x0',
    loading: false,
    tokenPrice: 1000000000000000,
    tokensSold: 0,
    tokensAvailable: 750000,

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
            //return App.render();
            App.listenForEvents();
        });
     })
   },

   // Listen for events emitted from the contract
   listenForEvents: function() {
       App.contracts.JoyTokenSale.deployed().then(function(instance) {
           instance.Sell({}, {
               fromBlock: 0,
               toBlock: 'latest',
           }).watch(function(error, event) {
               console.log("event triggered", event);
               
           })
           App.render();
       })
   },

   // Main function that will render the entire app
   render: function() {
    if (App.loading) {
        return;
    }   
    App.loading = true;

    var loader = $('#loader');
    var content = $('#content');

    loader.show();
    content.hide();

    // Load account data
    if(window.ethereum){
        window.ethereum.request({method: 'eth_requestAccounts'}).then(function(acc){
            App.account = acc[0];
            console.log("account:", App.account);
            $('#accountAddress').html("Your Account : " + App.account);
        })
    }
    
    // Load token sale contract
    App.contracts.JoyTokenSale.deployed().then(function(instance) {
        joyTokenSaleInstance = instance;
        return joyTokenSaleInstance.tokenPrice();
      }).then(function(tokenPrice) {
        console.log("tokenPrice:", tokenPrice.toNumber());
        App.tokenPrice = tokenPrice;
        $('.token-price').html(web3.fromWei(App.tokenPrice, "ether").toNumber());
        return joyTokenSaleInstance.tokensSold();
      }).then(function(tokensSold) {
          App.tokensSold = tokensSold.toNumber();
          $('.tokens-sold').html(App.tokensSold);
          console.log('tokensSold', App.tokensSold);
          $('.tokens-available').html(App.tokensAvailable);

          var progressPercent = (Math.ceil(App.tokensSold) / App.tokensAvailable) * 100;
          $('#progress').css('width', progressPercent + '%');
      
        // Load token contract
        App.contracts.JoyToken.deployed().then(function(instance) {
            joyTokenInstance = instance;
            return joyTokenInstance.balanceOf(App.account);
        }).then(function(balance) {
            $('.joy-balance').html(balance.toNumber());
            
            App.loading = false;
            loader.hide();
            content.show();
            
        })

      });

    },

    buyTokens: function() {
        $('#content').hide();
        $('#loader').show();
        var numberOfTokens = $('#numberOfTokens').val();
        App.contracts.JoyTokenSale.deployed().then(function(instance) {
            return instance.buyTokens(numberOfTokens, {
                from: App.account,
                value: numberOfTokens * App.tokenPrice,
                gas: 500000
            });
        }).then(function(result) {
            console.log("Tokens bought..")
            $('form').trigger('reset'); // reset number of tokens in form
            // Wait for the Sell event to get triggered
        });
    }
}

$(function() {
    $(window).load(function() {
        App.init();
    })
});
