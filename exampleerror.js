var testJSONString = '{"fruit":"apples", "val":45 8}'

try {
  JSON.parse(testJSONString)
} catch (e){
  console.log(e.toString())
}

