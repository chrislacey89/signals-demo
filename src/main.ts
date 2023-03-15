import "./style.css";
import { createSignal, createEffect } from "./reactive";

const [count, setCount] = createSignal<number>(0);
createEffect(() => {
  console.log(count());
});
setCount(10);

// steps: 
// 1. createSignal() returns a signal, which is a tuple of two functions
// 2. call createEffect() which pushes the effect onto the context stack
// 3. the callback is then executed - count() is called, which returns the value
//    of count
// 4. count() is our read function, which looks at the stack and sees the
//    effect. Because there is an effect, it adds it to the subscriptions list
//    then returns the value.
// 5. when we use setCount() to update the value to 10, we update the closure
//    value, then go over the list of subscriptions and execute them.