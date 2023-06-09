import "./style.css";
import { createSignal, createEffect } from "./reactive";

const arrayOfFoods = [
  { name: "apple", color: "red" },
  { name: "banana", color: "yellow" },
  { name: "orange", color: "orange" },
  { name: "grape", color: "purple" },
  { name: "pear", color: "green" },
  { name: "strawberry", color: "red" },
  { name: "blueberry", color: "blue" },
];
const [count, setCount] = createSignal(0);
const [count2, setCount2] = createSignal(2);
const [show, setShow] = createSignal(true);
const [foods, setFoods] = createSignal(arrayOfFoods);
createEffect(() => {
  if (show()) {
    console.log(count(), "count is running");
  } else {
    console.log(count2(), "count2 is running");
  }
});
setShow(false);
setCount(10);

// steps:
// 1. createSignal() returns a signal, which is a tuple of two functions
// 2. call createEffect() which first cleans up any previous effects, then
//    pushes the effect onto the context stack
// 3. the callback is then executed - count() is called, which returns the value
//    of count
// 4. count() is our read function, which looks at the stack and sees the
//    effect. Because there is an effect, it adds it calls subscribe() which
//    adds to the subscriptions list and adds the subscriptions list to the
//    dependencies list. It then returns the value.
// 5. when we use setCount() to update the value to 10, we update the closure
//    value, then go over the list of subscriptions and execute them.

// add click button and increment count on click
const button = document.createElement("button");
button.textContent = "Increment";
button.addEventListener("click", () => {
  setCount(count() + 1);
});

//display the count
const div = document.createElement("div");
createEffect(() => {
  div.textContent = count().toString();
});
document.body.appendChild(button);
document.body.appendChild(div);

const input = document.createElement("input");
input.addEventListener("input", (e) => {
  const value = (e.target as HTMLInputElement).value;
  setFoods(arrayOfFoods.filter((food) => food.name.includes(value)));
});
// display array of foods
const ul = document.createElement("ul");
createEffect(() => {
  ul.innerHTML = "";
  foods().forEach((food) => {
    const li = document.createElement("li");
    li.textContent = food.name;
    li.style.color = food.color;
    ul.appendChild(li);
  });
});
document.body.appendChild(input);
document.body.appendChild(ul);
