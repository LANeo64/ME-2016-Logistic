/** @function create_table
 * This function just creates some table dependent on the given json.
 * The Json should have the structure as follows: * 
 * (array)[ (object){
 *      user : user name (something nice to show)
 *      name : name of the thing (string)
 *      quantity : how much of that thing (integer)
 *      perishable : if it is some kind of banana or a pencil (boolean - 1/one/true means it is a banana)
 *      storage : name of the storage where the thing should be deposited (string)
 *      buy_price : it is how much it cost to get the damn thing
 *      sell_price : how much money you want to grind from that duck
 *      date : some human readable date indicating when this was stored
 * }]
 * @param {Json} data
 * @returns {Html}
 */
function create_table(data){
    var html = "<table>"+
            "<tr><th>Name</th><th>Quantity</th><th>Storage</th><th>Perishable</th>"+
            "<th>Date</th><th>Buy price/pcs</th><th>Sell price/pcs</th>"+
            "<th>Total sell price</th><th>User</th></tr><tr>";
    var len = data.length;
    for(i = 0; i < len; i++) {
        html += "<tr><td>"+data[i].name+"</td><td>"+data[i].quantity+"</td>";
        html += "<td>"+data[i].storage+"</td><td>"+data[i].perishable+"</td>";
        html += "<td>"+data[i].date+"</td><td>"+data[i].buy_price+"</td>";
        html += "<td>"+data[i].sell_price+"</td>";
        html += "<td>"+data[i].sell_price*data[i].quantity+"</td>";
        html += "<td>"+data[i].user+"</td></tr>";
    }    
    html += "</table>";
    return html;
}

/** @function fill_select
 * Gets the options for a select
 * The Json should have a format as follows:
 * (array)[ (object){
 *      key : id (would be sent back as a key if as selected option)
 *      val : information sring (that's what user would see in the browser)
 * }]
 * 
 * @param {String} url Where <code>url</code> is a path to the file to call
 * @param {Json} payload <code>payload</code> is Json with one key and one value
 * @param {String} selector <code>selector</code> jQuery selector for the select
 * @returns {undefined}
 */
function fill_select(url, payload, selector){
    $.post(url,payload,function(data, status){
        if(status === "success"){
                var len = data.length;
                for(i = 0; i < len; i++) {
                    $(selector).append("<option value=\"" + data[0].key + "\">" + data[i].val + "</option>");
                }
            } else {
                $("#content").load("./html/op_failure.html");
                $("#content").children("p").last().html(status);
            }
    },"json");
}

/** @function fill_json
 * This function creates the json from the data that are currently filled
 * int he fields of the form which can be seen in /html/form.html file.
 * The spec of the Json is as follows:
 * user : user id (integer)
 * item_count : number of items in the items field (integer)
 * items : (array)[ (object){
 *      number : ordering number of the item (integer)
 *      name : name of the thing (string)
 *      quantity : how much of that thing (integer)
 *      perishable : if it is some kind of banana or a pencil (boolean - 1/one/true means it is a banana)
 *      storage : id of the storage where the thing should be deposited (integer)
 *      buy_price : it is how much it cost to get the damn thing
 *      sell_price : how much money you want to grind from that duck
 * }]
 * @returns {String}
 */
function fill_json(){
    var json = "";
    var len = $("#item_info").children().length;
    json += "{\"user\":\"" + $("#user_info fieldset select").val() + "\",";
    json += "\"item_count\":\"" + len.toString() + "\",";
    json += "\"items\":[";
    
    for(i = 0; i < len; i++) {
        json += "{\"number\":\"" + (i+1) + "\",";
        json += "\"name\":\"" + $("#item_info").children().eq(i).children("input[name='item_name']").val() + "\",";
        json += "\"quantity\":\"" + $("#item_info").children().eq(i).children("input[name='item_qty']").val() + "\",";
        json += "\"perishable\":\"" + $("#item_info").children().eq(i).children("select[name='perishable']").val() + "\",";
        json += "\"storage\":\"" + $("#item_info").children().eq(i).children("select[name='storage']").val() + "\",";
        json += "\"buy_price\":\"" + $("#item_info").children().eq(i).children("input[name='item_buy']").val() + "\",";
        json += "\"sell_price\":\"" + $("#item_info").children().eq(i).children("input[name='item_sell']").val() + "\"}";
        if ( (i+1) < len ){
            json += ",";
        }
    }
    json += "]}";
    
    return json;
}

/** @function insert_table
 * It inserts the table created by <code>create_table(data)</code> into the #content div
 * @returns {undefined}
 */
function insert_table(){
    $.post("./php/load.php","{\"payload\":\"items\"}",function(data, status){
        if(status === "success") {
            $("#content").html(create_table(data));
        } else {
            $("#content").load("./html/op_failure.html");
            $("#content").children("p").last().html(data);
        }
    },"json");
}

$(document).ready(function(){
    // this loads a default page content
    $("#content").load("./html/intro.html");
    
    // binds the #menu links to an event that will trigger loading the content for each particular link
    $("#menu ul li a").bind("click", function(e) {
        var url = $(this).attr("href");
        $("#content").load("./html/" + url); // load the html response into a DOM element
        e.preventDefault(); // stop the browser from following the link
    });
    
    // adds another row of fields for another item to store in the database
    $("#content").on( "click", "#add_item", function() {        
        var data = $("#item_info").children("fieldset").first().html();
        $("#item_info").append("<fieldset>" + data + "</fieldset>");
        //$.get("./html/form_item.html",function (data) { $("#item_info").append(data);});
    });
    
    // submits the form and sends the json to store.php file on the server
    $("#content").on( "click", "#submit_form", function() {
        //alert(fill_json()); // print the json in an alert window
        $.post("./php/store.php",fill_json(),function(data, status){
            //alert("Data: " + data + "\nStatus: " + status);
            if(status === "success"){
                $("#content").load("./html/op_success.html");
            } else {
                $("#content").load("./html/op_failure.html");
                $("#content").children("p").last().html(data);
            }
        });
    });
});