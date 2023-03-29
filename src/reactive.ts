type Effect = {
  execute: () => void;
  dependencies: Set<Set<Effect>>;
};
type Signal<T> = [() => T, (newValue: T) => void];

// how we keep track of the current effect that is running
const context: Array<Effect> = [];

export function createSignal<T>(value: T): Signal<T> {
  const subscriptions = new Set<Effect>();

  function read() {
    // grab the last effect that was pushed onto the context stack
    const effect = context[context.length - 1];
    // if there is an effect, add it to the subscriptions
    if (effect) {
      subscribe(effect, subscriptions);
    }
    return value;
  }
  function write(newValue: T) {
    // Because we have closed over value, we can access and update where it
    // points to. Whenever we call read(), we will return to the last place we
    // pointed value.
    value = newValue;
    // execute all the effects that are subscribed to this signal
    [...subscriptions].forEach((subscription) => subscription.execute());
  }
  return [read, write];
}

export function createEffect(callback: () => void) {
  const effect = {
    execute() {
      cleanup(effect);
      context.push(effect);
      callback();
      context.pop();
    },
    dependencies: new Set<Set<Effect>>(),
  };
  effect.execute();
}

function cleanup(effect: Effect) {
  effect.dependencies.forEach((dependency) => {
    dependency.delete(effect);
  });
  effect.dependencies.clear();
}

function subscribe(effect: Effect, subscriptions: Set<Effect>) {
  subscriptions.add(effect);
  effect.dependencies.add(subscriptions);
}
