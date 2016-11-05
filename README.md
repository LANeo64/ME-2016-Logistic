# ME-2016-Logistic
Simple web aplication for submission item evidence


Ukoly:

1 udelat html5 formulare s jQuery

2 udelat php script na ukladani do db

3 (optional) udelat tam jeste login


Prostředky:

1 html a php na akele

2 DB MariaDB (fork MySql)

Data:

1 Json formát pro data na odeslání z formuláře pro nové položky v DB
  user : user id (integer)
  item_count : number of items in the items field (integer)
  items : (array)[ (object){
      number : ordering number of the item (integer)
      name : name of the thing (string)
      quantity : how much of that thing (integer)
      perishable : if it is some kind of banana or a pencil (boolean - 1/one/true means it is a banana)
      storage : id of the storage where the thing should be deposited (integer)
      buy_price : it is how much it cost to get the damn thing
      sell_price : how much money you want to grind from that duck
  }]
  
  příklad: 
  {"user":"null","item_count":"3","items":[
    {"number":"1","name":"","quantity":"","perishable":"null","storage":"null","buy_price":"","sell_price":""},
    {"number":"2","name":"","quantity":"","perishable":"null","storage":"null","buy_price":"","sell_price":""},
    {"number":"3","name":"","quantity":"","perishable":"null","storage":"null","buy_price":"","sell_price":""}
  ]}

2 Json pro naplnění selectů ve formůláři
  (array)[ (object){
      key : id (would be sent back as a key if as selected option)
      val : information sring (that's what user would see in the browser)
  }]
 
  příklad:
  {"data":[
    {"key":"1","val":"xkrtulník"},
    {"key":"2","val":"xvrtulník"},
    {"key":"40","val":"xprtulník"}
  ]}
