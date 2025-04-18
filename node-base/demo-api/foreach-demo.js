
/*
  배열
*/


// 객체(또는 배열)에서 요소를 하나 꺼낸 다음
// 매개변수로 그 요소를 전달하여 호출되는 콜백함수


// 순서가있는 객체or배열 .forEach
const arr = [1,2,3,4,5];
arr.forEach( (item, index, arr) => {
  console.log(`item : ${item}, index : ${index}, arr : ${arr}`);
});


// Map과 .forEach 만남
let map = new Map();
map.set(7, "seven");
map.set(9, "nine");
map.set(8, "eight");
map.forEach( (value, key, map) => {
  console.log(`value : ${value}, key : ${key}, map : ${map}`);
});


// 객체or배열 .map()
let arr2 = [1,2,3,4,5,6,7];
let newArr2 = arr2.map( (item, index, arr) => {
  return item * 2;
});
console.log(newArr2);