var csomapi = require('csom-node'),
    settings = require('./settings.js').settings;

var webAbsoluteUrl = settings.tenantUrl + settings.webUrl;

csomapi.setLoaderOptions({ url: webAbsoluteUrl, serverType: 'local', packages: [] });


var authCtx = new AuthenticationContext(webAbsoluteUrl);
authCtx.acquireTokenForUser(settings.username, settings.password, function(err, data) {

    var ctx = new SP.ClientContext(settings.webUrl);
    authCtx.setAuthenticationCookie(ctx); //authenticate

    var web = ctx.get_web();
    console.log("1. Read list items");
    readListItems(web, "Tasks", function(items) {
        items.get_data().forEach(function(item) {
            console.log(item.get_fieldValues().Title);
        });
        console.log('Tasks have been read successfully');
        console.log("2. Create list item");
        createListItem(web, "Tasks", function(item) {

            console.log(String.format('Task {0} has been created successfully', item.get_item('Title')));
            console.log("3. Update list item");
            updateListItem(item,function(item) {
                console.log(String.format('Task {0} has been updated successfully', item.get_item('Title')));
                console.log("4. Delete list item");
                deleteListItem(item,function() {
                    console.log('Task has been deleted successfully');
                },logError);

            },logError);
            
        }, logError);

    }, logError);

});


function logError(sender, args) {
    console.log('An error occured: ' + args.get_message());
}


function readListItems(web, listTitle, success, error) {
    var ctx = web.get_context();
    var list = web.get_lists().getByTitle(listTitle);
    var items = list.getItems(SP.CamlQuery.createAllItemsQuery());
    ctx.load(items);
    ctx.executeQueryAsync(function() {
            success(items);
        },
        error);
}

function createListItem(web, listTitle,success,error) {
    var ctx = web.get_context();
    var list = web.get_lists().getByTitle(listTitle);
    var creationInfo = new SP.ListItemCreationInformation();
    var listItem = list.addItem(creationInfo);
    listItem.set_item('Title', 'New Task');
    listItem.update();
    ctx.load(listItem);
    ctx.executeQueryAsync(function () {
            success(listItem);
        },
    error);
}


function updateListItem(listItem,success,error) {
    var ctx = listItem.get_context();
    listItem.set_item('Title', 'New Task (updated)');
    listItem.update();
    ctx.load(listItem);
    ctx.executeQueryAsync(function () {
        success(listItem);
    },
    error);
}

function deleteListItem(listItem, success, error) {
    var ctx = listItem.get_context();
    listItem.deleteObject();
    ctx.executeQueryAsync(function () {
        success();
    },
    error);
}