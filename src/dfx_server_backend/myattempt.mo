
import Array "mo:base/Array";
import Iter "mo:base/Iter";
module {
  public class ArrayObj<X>(equal : (X, X) -> Bool, initial : ?[X]) {
    // Initialize the array, defaulting to an empty array if `initial` is null
    var arr = switch initial {
      case null { [] }; // Empty array
      case (?a) { a };  // Use the provided array
    };

    public func array() : [X] {
      arr
    };

    public func clone() : ArrayObj<X> {
      ArrayObj<X>(equal, ?arr) // O(n), creates a new array with the same elements
    };

    public func append(t : ArrayObj<X>) {
      arr := Array.append<X>(arr, t.array())
    };

    public func prepend(t : ArrayObj<X>) {
      arr := Array.append<X>(t.array(), arr)
    };

    public func add(x : X) {
      arr := Array.append<X>(arr, [x])
    };

    public func vals() : Iter.Iter<X> {
      Iter.fromArray(arr)
    };

    public func revVals() : Iter.Iter<X> {
      Iter.fromArray(Array.reverse(arr))
    };

    public func getLast() : ?X {
      if (Array.size(arr) > 0) {
        ?arr[Array.size(arr) - 1]
      } else {
        null
      }
    };
  };
}