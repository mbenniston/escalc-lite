export abstract class Stream<T> {
  public abstract next(): T | null
}
