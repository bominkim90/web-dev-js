// 자바스크립트 배열 비구조화
let arr = ["이게첫번째",2,3,4,5];
let [v1, v2] = arr;
let [ , , v3, v4, v5] = arr;

console.log("v1 :",v1);
console.log("v2 :",v2);
console.log("v3 :",v3);
console.log("v4 :",v4);
console.log("v5 :",v5);