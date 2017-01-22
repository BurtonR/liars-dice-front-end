var Datastore = require('nedb')
  , db = new Datastore();

var Die = require("./helpers/die");


/*
  Fields needed to create a new game:
  numPlayers (Integer)
  numDice (Integer)
 */
var Game = function(options) {
  this.document = options;
  
  if (!this.document.board) this.document.board = [];
  if (!this.document.actions) this.document.actions = [];

  if (!this.document.playerHands) {
    this.document.playerHands = [];
    this.createPlayers();
  }
};

Game.all = function(cb) {
  var results = [];
  db.find({}, function (err, docs) {
    cb(docs);
  });
};

Game.find = function(_id, cb) {
  db.findOne({_id: _id}, function(error, game) {
    cb(new Game(game));
  });
};

Game.prototype = {
  save: function(callback) {
    if (this.document._id == null) {
      this.create(callback);
    } else {
      this.update(callback);
    }
  },

  create: function(cb) {
    var self = this;

    if (!this.document.numPlayers || !this.document.numDice) {
      cb({
        error: "numPlayers and numDice is required"
      });
      return;
    }

    db.insert(this.document, function(error, newDoc) {
      if (error) {
        cb(error);
      } else {
        self.document._id = newDoc._id;
        cb();
      }
    });
  },

  update: function(cb) {
    db.update({_id: this.document._id}, this.document, {}, function() {
      cb();
    });
  },

  createPlayers: function() {
    for(var i=0; i < this.document.numPlayers; i++) {
      this.document.playerHands[i] = [];
      for(var j=0; j < this.document.numDice; j++) {
        this.document.playerHands[i][j] = Die.randomFace();
      }
    }
  }
};

module.exports = Game;