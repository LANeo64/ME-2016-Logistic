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
 * @param {bool} mobile
 * @returns {Html}
 */
function create_table(data, mobile) {
    var html = "";
    var len = data.length;
    
    html += "<table cellpadding=\"0\" cellspacing=\"0\" ";
    
    if (mobile) {
        html += "class=\"mobile_table\">";
        
        for (i = 0; i < len; i++) {
            html += "<tr><th>Položka " + parseInt(i+1) + "</th></tr>";
            html += "<tr><td class=\"key\">Název</td></tr><tr><td>" + data[i].name + "</td></tr>";
            html += "<tr><td class=\"key\">Množství</td></tr><tr><td>" + data[i].count + "</td></tr>";
            html += "<tr><td class=\"key\">Místo</td></tr><tr><td>" + data[i].place + "</td></tr>";
            html += "<tr><td class=\"key\">Typ</td></tr><tr><td>" + (data[i].type == 1 ? "Kazící se" : "Trvanlivé") + "</td></tr>";
            html += "<tr><td class=\"key\">Datum přidání</td></tr><tr><td>" + data[i].date + "</td></tr>";
            html += "<tr><td class=\"key\">Pořizovací cena</td></tr><tr><td>" + data[i].price + "</td></tr>";
            html += "<tr><td class=\"key\">Prodejní cena</td></tr><tr><td>" + data[i].predicted_price + "</td></tr>";
            html += "<tr><td class=\"key\">Celková cena</td></tr><tr><td>" + parseInt(data[i].predicted_price, 10) * parseInt(data[i].count, 10) + "</td></tr>";
            html += "<tr><td class=\"key\">Uživatel</td></tr><tr><td>" + data[i].user_name + "</td></tr>";
            html += "<tr><td class=\"key\">Poznámka</td></tr><tr><td>" + data[i].note + "</td></tr>";
        }
    } else {
        html += "class=\"regular_table\">" +
                "<tr><th>Name</th><th>Množství</th><th>Místo</th><th>Typ</th>" +
                "<th>Datum přidání</th><th>Pořizovací cena</th><th>Prodejní cena</th>" +
                "<th>Celková cena</th><th>Uživatel</th><th>Poznámka</th></tr><tr>";
        
        for (i = 0; i < len; i++) {
            html += "<tr><td>" + data[i].name + "</td>";
            html += "<td>" + data[i].count + "</td>";
            html += "<td>" + data[i].place + "</td>";
            html += "<td>" + (data[i].type == 1 ? "Kazící se" : "Trvanlivé") + "</td>";
            html += "<td>" + data[i].date + "</td>";
            html += "<td>" + data[i].price + "</td>";
            html += "<td>" + data[i].predicted_price + "</td>";
            html += "<td>" + parseInt(data[i].predicted_price, 10) * parseInt(data[i].count, 10) + "</td>";
            html += "<td>" + data[i].user_name + "</td>";
            html += "<td>" + data[i].note + "</td></tr>";
        }
    }
    html += "</table>";
    return html;
}

/** @function transform_json_array_to_key_val
 * Transforms array of json objects with format
 * {
 *  "whatever" : value,
 *  "whatever2" : value2
 * }
 * into
 * {
 *  "key" : value,
 *  "val" : value
 * }
 * @param {Json} array
 */
function transform_json_array_to_key_val(array)
{
    if (array.length === 0)
    {
        return array;
    }
    return array.map(function (el) {
        var keys = Object.keys(el);
        if (keys.length != 2)
        {
            throw new Error("Json object HAS to have 2 key value pairs!");
        }
        return {
            "key": el[keys[0]],
            "val": el[keys[1]]
        };
    });
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
function fill_select(url, payload, selector) {
    $.post(url, payload, function (data, status) {
        if (status === "success") {
            var json = transform_json_array_to_key_val(data);
            var len = json.length;
            for (i = 0; i < len; i++) {
                $(selector).append("<option value=\"" + json[i].key + "\">" + json[i].val + "</option>");
            }
        } else {
            $("#content").load("./html/op_failure.html");
            $("#content").children("p").last().html(status);
        }
    }, "json");
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
function fill_json() {
    var json = "";
    var len = $("#item_info").children().length;
    json += "{\"user\":\"" + $("#user_info fieldset select").val() + "\",";
    json += "\"item_count\":\"" + len.toString() + "\",";
    json += "\"items\":[";

    for (i = 0; i < len; i++) {
        json += "{\"number\":\"" + (i + 1) + "\",";
        json += "\"name\":\"" + $("#item_info").children().eq(i).find("input[name='item_name']").val() + "\",";
        json += "\"quantity\":\"" + $("#item_info").children().eq(i).find("input[name='item_qty']").val() + "\",";
        json += "\"perishable\":\"" + $("#item_info").children().eq(i).find("select[name='perishable']").val() + "\",";
        json += "\"storage\":\"" + $("#item_info").children().eq(i).find("select[name='storage']").val() + "\",";
        json += "\"buy_price\":\"" + $("#item_info").children().eq(i).find("input[name='item_buy']").val() + "\",";
        json += "\"note\" : \"" + $("#item_info").children().eq(i).find("#note").val() + "\",";
        json += "\"sell_price\":\"" + $("#item_info").children().eq(i).find("input[name='item_sell']").val() + "\"}";
        if ((i + 1) < len) {
            json += ",";
        }
    }
    json += "]}";
    //alert(json);

    return {data: json};
}

/** @function insert_table
 * It inserts the table created by <code>create_table(data)</code> into the #content div
 * @returns {undefined}
 */
function insert_table() {
    $.post("./php/query.php", {}, function (data, status) {
        if (status === "success") {
            var mobile = false;
            if ($(window).width() < 1000) {
                mobile = true;
            }
            $("#content").html(create_table(data, mobile));
        } else {
            $("#content").load("./html/op_failure.html");
            $("#content").children("p").last().html(data);
        }
    }, "json");
}

$(document).ready(function () {
    // this loads a default page content
    $("#content").load("./html/intro.html");

    // binds the #menu links to an event that will trigger loading the content for each particular link
    $("#menu ul li a").bind("click", function (e) {
        var url = $(this).attr("href");
        $("#content").load("./html/" + url); // load the html response into a DOM element
        e.preventDefault(); // stop the browser from following the link
    });

    // adds another row of fields for another item to store in the database
    $("#content").on("click", "#add_item", function () {
        if($("#item_info").children("fieldset").length == 1){
            $("#item_info").children("fieldset").first().find(".remove_item").show();
        }
        var data = $("#item_info").children("fieldset").first().html();
        $("#item_info").append("<fieldset>" + data + "</fieldset>");
        
        
        //$.get("./html/form_item.html",function (data) { $("#item_info").append(data);});
    });
    
    $("#content").on("click", ".remove_item", function () {
        var item_count = $(this).parent().siblings().length + 1;
        if(item_count == 1) {
            $(this).closest("form").find("input[type=text], textarea").val("");
            $(this).hide();
        } else {
            $(this).parent().remove();
        }
    });

    // submits the form and sends the json to store.php file on the server
    $("#content").on("click", "#submit_form", function () {
        //alert(fill_json()); // print the json in an alert window
        $.post("php/store.php", fill_json(), function (data, status) {
            console.log("Data: " + data + "\nStatus: " + status);
            if (status === "success") {
                $("#content").load("./html/op_success.html");
            } else {
                $("#content").load("./html/op_failure.html");
                $("#content").children("p").last().html(data);
            }
        });
    });

    $("#content").on("click", "#note", function () {
        $(this).html("");
    });
});
