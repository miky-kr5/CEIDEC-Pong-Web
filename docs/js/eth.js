myWeb3 = null;
myWeb3Provider = null;
pong = null;
myAccount = null;

function canIPlayTheGame() {
    pong.deployed().then(function(instance) {
	return instance.play({from: myAccount, value: web3.toWei(1, "ether"), gas: 500000});
    }).then(function(result) {
	if (result.logs[0].args.player === myAccount) {
	    $('#can_play').text(myAccount + ' can play the game!');
	    getTimesPlayed();
	    loadBalance(false);
	    playTheGame();
	} else {
	    alert("Whoops! An error ocurred.\nThanks for your money, though :P");
	}
    }).catch(function(error) {
	console.error(error);
    });
}

function loadBalance(sad) {
    myWeb3.eth.getCoinbase(function(err, account) {
	if (err === null) {
	    myAccount = account;
	    myWeb3.eth.getBalance(account, function(err, balance) {
		if (err === null) {
		    $('#balance').text(myWeb3.fromWei(balance, "ether") + " ETH");
		    if (sad)
			$('#can_play').text(myAccount + " can't play the game... so sad!");
		}
	    });
	}
    });
}

function getTimesPlayed() {
    pong.deployed().then(function(instance) {
	return instance.howManytimesPlayed();
    }).then(function(timesPlayed) {
	$('#times_played').text("The game has been played " + timesPlayed.toNumber() + " times!");
    }).catch(function(error) {
	console.error(error.message);
    });
}

function initWeb3() {
    // Initialize web3
    if (typeof web3 !== 'undefined') {
	// Reuse the provider of the web3 object injected by Metamask
	console.log("Using injected web3 provider");
	myWeb3Provider = web3.currentProvider;
    } else {
	// Create a new provider and plug it directed in our local node
	console.log("Creating new web3 provider");
	myWeb3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    myWeb3 = new Web3(myWeb3Provider);
    
    $.getJSON('Pong.json', function(pongArtifact) {
	// Get the contract artifact file and use it to instantiate a truffle contract abstraction
	pong = TruffleContract(pongArtifact);
	// Set the provider for our contract
	pong.setProvider(myWeb3Provider);

	// update UI
	loadBalance(true);
	getTimesPlayed();

	// Register call and listen for events.
	ethCallback = canIPlayTheGame;
    });
}

$(function() {
    $(window).load(function() {
        initWeb3();
    });
});
