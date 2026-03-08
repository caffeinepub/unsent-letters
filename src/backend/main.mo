import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Time "mo:core/Time";
import List "mo:core/List";
import Order "mo:core/Order";

actor {
  type Message = {
    id : Nat;
    to : Text;
    message : Text;
    song : Text;
    color : Text;
    timestamp : Int;
  };

  module Message {
    public func compareByTimestampDescending(a : Message, b : Message) : Order.Order {
      Int.compare(b.timestamp, a.timestamp);
    };
  };

  var nextId = 0;
  let messages = List.empty<Message>();

  public shared ({ caller }) func submitMessage(to : Text, message : Text, song : Text, color : Text) : async Nat {
    let msg : Message = {
      id = nextId;
      to;
      message;
      song;
      color;
      timestamp = Time.now();
    };

    messages.add(msg);
    nextId += 1;
    msg.id;
  };

  public query ({ caller }) func getMessages() : async [Message] {
    messages.toArray().sort(Message.compareByTimestampDescending);
  };

  public query ({ caller }) func searchMessages(queryString : Text) : async [Message] {
    let lowerQuery = queryString.toLower();
    messages.filter(func(msg) { msg.to.toLower().contains(#text lowerQuery) }).toArray().sort(Message.compareByTimestampDescending);
  };
};
