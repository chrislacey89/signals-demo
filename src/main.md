```ts
import "./style.css";
import { createSignal, createEffect } from "./reactive";

const [count, setCount] = createSignal(0);
const [count2, setCount2] = createSignal(2);
const [show, setShow] = createSignal(true);
createEffect(() => {
  if (show()) {
    console.log(count(), 'count is running');
  } else {
    console.log(count2(), 'count2 is running');
  }
});
setShow(false);
setCount(10);
```


steps:

0. A context array is created to keep track of the current effect that is running
1. call `createSignal`. Each signal is a function that accepts an initial
   value as an argument and contains a subscriptions list. Because of closure
   a reference pointing to the initial value and the subscriptions list will
   be preserved so we can continue to make updates to where the value points to.
   createSignal() returns a tuple of two functions: a getter - `read` and
   a setter - `write`.
   read() checks the last effect that was pushed onto the context stack. If
   it finds one it will call `subscribe` on that last effect, adding the effect to the
   subscriptions list and adding the subscriptions list to the effect
   dependencies list.
   `write` accepts a new value as an argument and updates the closed initial
   value, which automatically updates the value returned by `read`. It then
   makes a copy of the subscriptions list and executes each effect in the list.


2. call `createEffect` which accepts a callback and creates an effect object
   with an execute method, then immediately calls the execute method.
   the execute method first cleans up any previous effects. `cleanup`
   works by going over the dependencies list which is actually a list that
   contains a reference to any closed over subscriptions lists. It then
   removes each effect from the subscriptions list, then clears the dependencies
   list.
   `effect.execute` then pushes the effect onto the context stack, calls the
   callback function and then pops the effect off the context stack. The first
   function called inside the callback is `show`. `show` checks if there is an
   effect on the context stack. There is because we are still inside of
   `effect.execute`. The effect is present so we call subscribe on the effect.
   At this point the effect has no dependencies and the execute method is a
   reference to the `show` function. The effect is added to the subscriptions
   list and the effect dependencies list is updated to contain a reference to
   the subscriptions list. The effect is then returned.


3. The callback in this case is - calls the read function `show` which
   returns the value of the signal. Because there is no effect on the stack,
   it does not call subscribe. It then returns the value.

4. count() is our read function, which looks at the stack and sees the
   effect. Because there is an effect, it adds it calls subscribe() which
   adds to the subscriptions list and adds the subscriptions list to the
   dependencies list. It then returns the value.
5. when we use setCount() to update the value to 10, we update the closure
   value, then go over the list of subscriptions and execute them.
```ts
const button = document.createElement("button");
button.textContent = "Increment";
button.addEventListener("click", () => {
  setCount(count() + 1);
});

//display the count
const div = document.createElement("div");
createEffect(() => {
  div.textContent = count().toString();
} )
document.body.appendChild(button);
document.body.appendChild(div);
```