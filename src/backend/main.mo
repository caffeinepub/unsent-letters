import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Migration "migration";

(with migration = Migration.run)
actor {
  type Message = {
    id : Nat;
    to : Text;
    message : Text;
    song : Text;
    color : Text;
    timestamp : Int;
    isPrivate : Bool;
    isSeeded : Bool;
  };

  var nextId = 12;
  let messageStore = Map.empty<Nat, Message>();

  let sampleMessages = [
    {
      id = 0;
      to = "maya";
      message = "i still think about the night we stayed up until 4am talking about everything and nothing. i never told you that was the happiest i'd felt in years.";
      song = "death bed - powfu";
      color = "#f4b8c8";
      timestamp = 1_700_000_000_000_000_000;
      isPrivate = false;
      isSeeded = true;
    },
    {
      id = 1;
      to = "dad";
      message = "i know we never said it out loud. but i hope you knew. i really hope you knew.";
      song = "supermarket flowers - ed sheeran";
      color = "#b8d4f4";
      timestamp = 1_701_000_000_000_000_000;
      isPrivate = false;
      isSeeded = true;
    },
    {
      id = 2;
      to = "lena";
      message = "you were my first real friend and i let you drift away without even trying to hold on. i'm sorry. i think about you every time it rains.";
      song = "the night we met - lord huron";
      color = "#c9b8e8";
      timestamp = 1_702_000_000_000_000_000;
      isPrivate = false;
      isSeeded = true;
    },
    {
      id = 3;
      to = "james";
      message = "i almost called you last tuesday. just to hear your voice. i didn't. i wish i had.";
      song = "ivy - frank ocean";
      color = "#b8e8c9";
      timestamp = 1_703_000_000_000_000_000;
      isPrivate = false;
      isSeeded = true;
    },
    {
      id = 4;
      to = "grandma";
      message = "i still make your soup every winter. it never tastes exactly right but trying feels like talking to you.";
      song = "see you again - tyler the creator";
      color = "#f4d4b8";
      timestamp = 1_704_000_000_000_000_000;
      isPrivate = false;
      isSeeded = true;
    },
    {
      id = 5;
      to = "alex";
      message = "you deserved better than the version of me i gave you. i was so scared of being loved that i made sure you'd leave. i'm sorry for that.";
      song = "liability - lorde";
      color = "#f4b8e4";
      timestamp = 1_705_000_000_000_000_000;
      isPrivate = false;
      isSeeded = true;
    },
    {
      id = 6;
      to = "milo";
      message = "you were just a dog. but losing you broke something in me i didn't expect. i still reach for you on the couch sometimes.";
      song = "ray of light - madonna";
      color = "#e8d4b8";
      timestamp = 1_706_000_000_000_000_000;
      isPrivate = false;
      isSeeded = true;
    },
    {
      id = 7;
      to = "sara";
      message = "thank you for showing up at my door that night without me even asking. you didn't say anything. you just sat with me. that was everything.";
      song = "golden hour - kacey musgraves";
      color = "#b8e8e4";
      timestamp = 1_707_000_000_000_000_000;
      isPrivate = false;
      isSeeded = true;
    },
    {
      id = 8;
      to = "noah";
      message = "i forgive you. i don't think i'll ever tell you that in person, but i needed to say it somewhere. i forgive you and i hope you're okay.";
      song = "white flag - joseph";
      color = "#e8e8b8";
      timestamp = 1_708_000_000_000_000_000;
      isPrivate = false;
      isSeeded = true;
    },
    {
      id = 9;
      to = "my younger self";
      message = "it gets softer. not easier exactly, but softer. you will find people who stay. please stop apologizing for taking up space.";
      song = "anti-hero - taylor swift";
      color = "#d4b8f4";
      timestamp = 1_709_000_000_000_000_000;
      isPrivate = false;
      isSeeded = true;
    },
    {
      id = 10;
      to = "chloe";
      message = "i never told you that you were the reason i kept going that semester. you didn't know you were saving me every time you texted. thank you.";
      song = "1000 times - sara bareilles";
      color = "#f4c8b8";
      timestamp = 1_710_000_000_000_000_000;
      isPrivate = false;
      isSeeded = true;
    },
    {
      id = 11;
      to = "him";
      message = "i deleted your number three times. memorized it each time without meaning to. some people just live in your hands.";
      song = "sparks - coldplay";
      color = "#b8c8e8";
      timestamp = 1_711_000_000_000_000_000;
      isPrivate = false;
      isSeeded = true;
    },
  ];

  do {
    for (message in sampleMessages.values()) {
      messageStore.add(message.id, message);
    };
  };

  module Message {
    public func compareByTimestampDescending(a : Message, b : Message) : Order.Order {
      Int.compare(b.timestamp, a.timestamp);
    };
  };

  public shared ({ caller }) func submitMessage(to : Text, message : Text, song : Text, color : Text, isPrivate : Bool) : async Nat {
    let msg : Message = {
      id = nextId;
      to;
      message;
      song;
      color;
      timestamp = Time.now();
      isPrivate;
      isSeeded = false;
    };

    messageStore.add(nextId, msg);
    nextId += 1;
    msg.id;
  };

  public query ({ caller }) func getMessages() : async [Message] {
    let messagesArray = messageStore.values().toArray();
    let filtered = messagesArray.filter(func(msg) { not msg.isPrivate });
    filtered.sort(Message.compareByTimestampDescending);
  };

  public query ({ caller }) func searchMessages(queryString : Text) : async [Message] {
    let lowerQuery = queryString.toLower();
    let messagesArray = messageStore.values().toArray();
    let filtered = messagesArray.filter(
      func(msg) {
        if (msg.isPrivate) {
          msg.to.toLower() == lowerQuery;
        } else {
          msg.to.toLower().contains(#text lowerQuery);
        };
      }
    );
    filtered.sort(Message.compareByTimestampDescending);
  };
};
