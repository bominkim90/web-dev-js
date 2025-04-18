
function first(){
  console.log("첫 번째");
}

function second(){
  setTimeout(function(){
    console.log("setTimeout 안에");
  }, 1000);
  console.log('두 번째');
}

function third(){
  console.log("세 번째");
}

first();
second();
third();