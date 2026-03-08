import Map "mo:core/Map";
import Nat "mo:core/Nat";

module {
  type OldMessage = {
    id : Nat;
    to : Text;
    message : Text;
    song : Text;
    color : Text;
    timestamp : Int;
  };

  type OldActor = {
    nextId : Nat;
    messageStore : Map.Map<Nat, OldMessage>;
  };

  type NewMessage = {
    id : Nat;
    to : Text;
    message : Text;
    song : Text;
    color : Text;
    timestamp : Int;
    isPrivate : Bool;
    isSeeded : Bool;
  };

  type NewActor = {
    nextId : Nat;
    messageStore : Map.Map<Nat, NewMessage>;
  };

  public func run(old : OldActor) : NewActor {
    let newMessageStore = old.messageStore.map<Nat, OldMessage, NewMessage>(
      func(_id, oldMessage) {
        {
          oldMessage with
          isPrivate = false;
          isSeeded = false;
        };
      }
    );
    { old with nextId = 12; messageStore = newMessageStore };
  };
};
